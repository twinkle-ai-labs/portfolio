import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@Store/index';
import {Language, LanguageType} from '@Store/slice/language';

/** 언어별 값을 함께 들고 다니는 컨테이너. 데이터 파일의 각 필드에 그대로 붙입니다. */
export type Localized<T> = { ko: T; en: T };

/** 가장 흔한 형태 — 언어별 문자열. */
export type LocalizedText = Localized<string>;

const isLocalized = <T, >(value: unknown): value is Localized<T> =>
    typeof value === 'object' && value !== null && 'ko' in value && 'en' in value;

/**
 * 현재 언어로 값을 고릅니다.
 * 이미 번역이 필요 없는 원시값(기술명 등)이 들어와도 그대로 통과시킵니다.
 */
export const localize = <T, >(value: Localized<T> | T, language: Language): T =>
    isLocalized<T>(value) ? value[language] : value;

/**
 * 현재 언어와 번역 헬퍼를 함께 돌려줍니다.
 *
 *   const {t, language} = useLocale();
 *   <h2>{t(project.title)}</h2>
 */
export const useLocale = () => {
    const language = useSelector((state: RootState) => state.language.value) as Language;

    const t = useCallback(
        <T, >(value: Localized<T> | T): T => localize(value, language),
        [language],
    );

    return {language, t, isKorean: language === LanguageType.KO};
};

export default useLocale;
