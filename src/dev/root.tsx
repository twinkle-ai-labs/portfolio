import React from 'react';
import {DevSupport} from '@react-buddy/ide-toolbox';
import {ComponentPreviews, useInitial} from './index';

const DevRoot = ({children}: { children: React.ReactElement }) => (
    <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
        {children}
    </DevSupport>
);

export default DevRoot;
