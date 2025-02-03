import React from '../../../lib/teact/teact';

import buildClassName from '../../../util/buildClassName';

import styles from './MenuIcon.module.scss';

type OwnProps = {
  hasMenu?: boolean;
  shouldSkipTransition?: boolean;
};

const MenuIcon = ({
  hasMenu,
  shouldSkipTransition,
}: OwnProps) => {
  return (
    <div className={buildClassName(
      styles.root,
      !hasMenu && styles.stateBack,
      shouldSkipTransition && styles.noAnimation,
    )}
    />
  );
};

export default MenuIcon;
