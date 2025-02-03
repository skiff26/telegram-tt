import type { FC } from '../../../lib/teact/teact';
import React, { memo, useMemo } from '../../../lib/teact/teact';
import { getActions } from '../../../global';

import type { ApiChatFolder, ApiChatlistExportedInvite, ApiSession } from '../../../api/types';
import type { GlobalState } from '../../../global/types';
import type { FolderEditDispatch } from '../../../hooks/reducers/useFoldersReducer';
import { LeftColumnContent, type SettingsScreens } from '../../../types';

import {
  APP_NAME,
  DEBUG,
  IS_BETA,
} from '../../../config';
import buildClassName from '../../../util/buildClassName';
import { IS_ELECTRON, IS_MAC_OS } from '../../../util/windowEnvironment';

import useAppLayout from '../../../hooks/useAppLayout';
import useFlag from '../../../hooks/useFlag';
import useLang from '../../../hooks/useLang';
import useOldLang from '../../../hooks/useOldLang';
import { useFullscreenStatus } from '../../../hooks/window/useFullscreen';

import MenuIcon from '../../common/icons/MenuIcon';
import Button from '../../ui/Button';
import DropdownMenu from '../../ui/DropdownMenu';
import LeftSideMenuItems from './LeftSideMenuItems';

import './LeftSidebar.scss';

type OwnProps = {
  content: LeftColumnContent;
  shouldSkipTransition?: boolean;
  shouldHideFolderTabs?: boolean;
  isForumPanelOpen?: boolean;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
  onLeftColumnContentChange: (content: LeftColumnContent) => void;
  foldersDispatch: FolderEditDispatch;
  onSelectSettings: NoneToVoidFunction;
  onSelectContacts: NoneToVoidFunction;
  onSelectArchived: NoneToVoidFunction;
  onReset: NoneToVoidFunction;
};

type StateProps = {
  chatFoldersById: Record<number, ApiChatFolder>;
  folderInvitesById: Record<number, ApiChatlistExportedInvite[]>;
  orderedFolderIds?: number[];
  activeChatFolder: number;
  currentUserId?: string;
  shouldSkipHistoryAnimations?: boolean;
  maxFolders: number;
  maxChatLists: number;
  maxFolderInvites: number;
  hasArchivedChats?: boolean;
  hasArchivedStories?: boolean;
  archiveSettings: GlobalState['archiveSettings'];
  isStoryRibbonShown?: boolean;
  sessions?: Record<string, ApiSession>;
};

const LeftSidebar: FC<OwnProps> = ({
  content,
  shouldSkipTransition,
  shouldHideFolderTabs,
  isForumPanelOpen,
  // onSettingsScreenSelect,
  // onLeftColumnContentChange,
  // foldersDispatch,
  // chatFoldersById,
  // orderedFolderIds,
  // activeChatFolder,
  // currentUserId,
  // shouldSkipHistoryAnimations,
  // maxFolders,
  // maxChatLists,
  // folderInvitesById,
  // maxFolderInvites,
  // hasArchivedChats,
  // hasArchivedStories,
  // archiveSettings,
  // isStoryRibbonShown,
  // sessions,
  onSelectSettings,
  onSelectContacts,
  onSelectArchived,
  onReset,
  ref,
}) => {
  const oldLang = useOldLang();
  const lang = useLang();
  const { isMobile, isDesktop } = useAppLayout();

  const isFullscreen = useFullscreenStatus();

  const [isBotMenuOpen, markBotMenuOpen, unmarkBotMenuOpen] = useFlag();

  const hasMenu = content === LeftColumnContent.ChatList;

  const versionString = IS_BETA ? `${APP_VERSION} Beta (${APP_REVISION})` : (DEBUG ? APP_REVISION : APP_VERSION);

  const {
    loadChatFolders,
    setActiveChatFolder,
    openChat,
    openShareChatFolderModal,
    openDeleteChatFolderModal,
    openEditChatFolder,
    openLimitReachedModal,
  } = getActions();

  const MainButton: FC<{ onTrigger: () => void; isOpen?: boolean }> = useMemo(() => {
    return ({ onTrigger, isOpen }) => (
      <Button
        ripple={hasMenu && !isMobile}
        color="translucent"
        className={isOpen ? 'active' : ''}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={hasMenu ? onTrigger : () => onReset()}
        ariaLabel={hasMenu ? oldLang('AccDescrOpenMenu2') : 'Return to chat list'}
      >
        <MenuIcon
          hasMenu={hasMenu}
          shouldSkipTransition={shouldSkipTransition}
        />
      </Button>
    );
  }, [hasMenu, isMobile, oldLang, onReset, shouldSkipTransition]);

  return (
    <aside id="LeftSidebar">
      <DropdownMenu
        trigger={MainButton}
        footer={`${APP_NAME} ${versionString}`}
        className={buildClassName(
          'main-menu',
          'disable-transition',
        )}
        forceOpen={isBotMenuOpen}
        transformOriginX={IS_ELECTRON && IS_MAC_OS && !isFullscreen ? 90 : undefined}
      >
        <LeftSideMenuItems
          onSelectArchived={onSelectArchived}
          onSelectContacts={onSelectContacts}
          onSelectSettings={onSelectSettings}
          onBotMenuOpened={markBotMenuOpen}
          onBotMenuClosed={unmarkBotMenuOpen}
        />
      </DropdownMenu>
    </aside>
  );
};

export default memo(LeftSidebar);
