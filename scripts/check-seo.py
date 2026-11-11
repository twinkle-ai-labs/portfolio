"""Validate the deployed HTML contract using Python's standard library."""
import json
import struct
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'scripts/seo-config.json').read_text())
OUT = ROOT / CONFIG['output']
BASE = CONFIG['base']
errors = []

def check(ok, message):
    if not ok:
        errors.append(message)

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.lang = ''
        self.titles = []
        self.meta = {}
        self.links = []
        self.schemas = []
        self.h1 = 0
        self.active = None
        self.text = ''
        self.feed(file.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html': self.lang = attrs.get('lang', '')
        if tag == 'meta': self.meta.setdefault(attrs.get('name', attrs.get('property', '')), []).append(attrs.get('content', ''))
        if tag == 'link': self.links.append(attrs)
        if tag == 'h1': self.h1 += 1
        if tag == 'title' or (tag == 'script' and attrs.get('type') == 'application/ld+json'):
            self.active, self.text = tag, ''
    def handle_data(self, text):
        if self.active: self.text += text
    def handle_endtag(self, tag):
        if tag == self.active:
            if tag == 'title': self.titles.append(self.text)
            else: self.schemas.append(json.loads(self.text))
            self.active = None
    def value(self, key):
        return self.meta.get(key, [''])[0]
    @property
    def canonical(self):
        return [link.get('href', '') for link in self.links if link.get('rel') == 'canonical']
    @property
    def alternates(self):
        return {link['hreflang']: link['href'] for link in self.links if link.get('hreflang')}

def normalized(url):
    return unquote(url)

def local_file(url):
    parsed, base = urlsplit(url), urlsplit(BASE)
    if parsed.scheme != 'https' or parsed.netloc != base.netloc:
        return None
    path = unquote(parsed.path)
    if not path.startswith(base.path):
        return None
    target = OUT / path[len(base.path):]
    return target / 'index.html' if path.endswith('/') else target

if not OUT.is_dir():
    sys.exit('Build the site before checking SEO.')
root = ET.fromstring((OUT / 'sitemap.xml').read_text())
entries = root.findall('{*}url')
urls = [entry.find('{*}loc').text for entry in entries]
check(bool(urls) and len(urls) == len(set(urls)), 'Sitemap must contain unique canonical pages')
pages = {}
for url in urls:
    file = local_file(url)
    check(file is not None and file.is_file(), f'{url}: missing exported page')
    if file is not None and file.is_file(): pages[normalized(url)] = Page(file)
images = set()
OG_LOCALES = {'ko':'ko_KR','en':'en_US','ja':'ja_JP','zh-CN':'zh_CN','zh-TW':'zh_TW','es':'es_ES','de':'de_DE','fr':'fr_FR','it':'it_IT','pt-BR':'pt_BR','id':'id_ID'}
for url, page in pages.items():
    check(len(page.titles) == 1 and bool(page.titles[0].strip()), f'{url}: expected one nonempty title')
    title = page.titles[0] if page.titles else ''
    check(len(page.meta.get('description', [])) == 1 and bool(page.value('description').strip()), f'{url}: expected one nonempty description')
    check(len(page.canonical) == 1 and normalized(page.canonical[0]) == url, f'{url}: canonical mismatch')
    check(not urlsplit(page.canonical[0] if page.canonical else url).query and not urlsplit(url).fragment, f'{url}: noncanonical query/fragment')
    check('noindex' not in ','.join(page.meta.get('robots', []) + page.meta.get('googlebot', [])), f'{url}: sitemap contains noindex page')
    check(page.lang in OG_LOCALES, f'{url}: unsupported HTML language {page.lang}')
    check(page.h1 >= 1, f'{url}: missing statically rendered H1')
    check(page.value('og:locale') == OG_LOCALES.get(page.lang), f'{url}: OG language differs from content language')
    check(normalized(page.value('og:url')) == url, f'{url}: OG URL differs from canonical')
    for kind in ('og', 'twitter'):
        check(page.value(f'{kind}:title') == title, f'{url}: {kind} title differs from search title')
        check(page.value(f'{kind}:description') == page.value('description'), f'{url}: {kind} description differs from search description')
        check(bool(page.value(f'{kind}:image:alt')), f'{url}: missing {kind} image alt')
    image = page.value('og:image')
    check(image == page.value('twitter:image'), f'{url}: inconsistent sharing image')
    check(page.value('twitter:card') == 'summary_large_image', f'{url}: missing large sharing card')
    images.add(image)
    check(page.value('og:image:width') == '1200' and page.value('og:image:height') == '630', f'{url}: incorrect image metadata size')
    check(bool(page.schemas), f'{url}: missing JSON-LD')
    for schema in page.schemas:
        for node in schema.get('@graph', [schema]):
            if node.get('@type') in ('WebPage', 'CollectionPage', 'TechArticle'):
                check(normalized(node.get('url', '')) == url, f'{url}: schema URL mismatch')
                check(node.get('inLanguage') == page.lang, f'{url}: schema language mismatch')
    for lang, target in page.alternates.items():
        other = pages.get(normalized(target))
        check(other is not None, f'{url}: hreflang target is not a sitemap canonical: {target}')
        if other:
            check({k:normalized(v) for k,v in other.alternates.items()} == {k:normalized(v) for k,v in page.alternates.items()}, f'{url}: nonreciprocal hreflang')
            if lang != 'x-default': check(other.lang == lang, f'{url}: hreflang language mismatch')
for entry in entries:
    url = normalized(entry.find('{*}loc').text)
    links = {a.attrib['hreflang']: normalized(a.attrib['href']) for a in entry.findall('{*}link')}
    if url in pages: check(links == {k:normalized(v) for k,v in pages[url].alternates.items()}, f'{url}: sitemap and HTML hreflang differ')
for image in images:
    file = local_file(image)
    check(file is not None and file.is_file(), f'{image}: missing sharing image')
    if file is not None and file.is_file():
        data = file.read_bytes()
        check(data[:8] == b'\x89PNG\r\n\x1a\n' and len(data) >= 24 and struct.unpack_from('>II', data, 16) == (1200,630), f'{image}: sharing image is not 1200x630 PNG')
for path in CONFIG.get('noindex', ['404.html']):
    file = OUT / path
    if file.exists():
        page = Page(file)
        check('noindex' in page.value('robots'), f'{path}: must be noindex')
robots = OUT / 'robots.txt'
check(robots.is_file() and BASE + 'sitemap.xml' in robots.read_text(), 'robots.txt must advertise the canonical sitemap')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'SEO verified: {len(pages)} canonical pages, {len(images)} sharing images; metadata, languages, schemas, sitemap and robots passed.')
