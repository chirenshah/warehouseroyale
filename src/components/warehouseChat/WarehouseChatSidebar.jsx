import { useEffect, useState } from 'react';
// Hooks
import { useCollection } from '../../hooks/useCollection';
// Material components
import Badge from '@mui/material/Badge';
// Components
import WarehouseLoader from '../ui/WarehouseLoader';
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
// Material icons
import { MdModeEdit } from 'react-icons/md';
import { MdOutlineArrowBackIos } from 'react-icons/md';
// Firebase services
import {
  makeNotificationRead,
  markChatAsRead,
} from '../../Database/firestoreService';
// Helpers
import { getUsersList } from './helpers/getUsersList';
// Constants
import { COLLECTION_TEAMS, DOC_TEAMS } from '../../utils/constants';

export default function WarehouseChatSidebar({
  currentUser,
  classId,
  chatMembers,
  chatMembersPending,
  activeChatMember,
  setActiveChatMember,
  loadNewChatMember,
}) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showChatMembersList, setShowChatMembersList] = useState(true);
  const [showTeamList, setShowTeamList] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    const callMakeNotificationRead = chatMembers?.every(
      (member) => member.isRead
    );

    if (callMakeNotificationRead) {
      makeNotificationRead(currentUser.email, 'Message');
    }
  }, [chatMembers]);

  const {
    documents: teams,
    isPending: teamsPending,
    error: teamsError,
  } = useCollection(`${classId}/${DOC_TEAMS}/${COLLECTION_TEAMS}`);

  const showList = (list) => {
    switch (list) {
      case 'chatMemberList':
        setShowChatMembersList(true);
        break;
      case 'teamList':
        setShowTeamList(true);
        break;
      case 'usersList':
        setShowUsersList(true);
        break;
      default:
        break;
    }
  };

  const hideLists = () => {
    setShowChatMembersList(false);
    setShowTeamList(false);
    setShowUsersList(false);
  };

  const handleShowList = (list) => {
    hideLists();
    showList(list);
  };

  const handleInitiateChat = async (receiverId) => {
    // Check if chat is already initiated with receiverId
    const foundChatMemberWithAlreadyInitiatedChat = chatMembers.find(
      (member) => member.id === receiverId
    );

    if (foundChatMemberWithAlreadyInitiatedChat) {
      setActiveChatMember(receiverId);
      handleShowList('chatMemberList');
    } else {
      loadNewChatMember({ id: receiverId });
      setActiveChatMember(receiverId);
      handleShowList('chatMemberList');
    }
  };

  return (
    <div className="warehouseChat__left">
      {teamsError && <WarehouseSnackbar text={teamsError} />}
      <div className="warehouseChat__leftHeader">
        <h3>Chats</h3>
        <MdModeEdit
          onClick={() => {
            setShowChatMembersList(false);
            setShowTeamList(true);
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {showChatMembersList &&
        (chatMembersPending || !chatMembers ? (
          <WarehouseLoader />
        ) : !chatMembers.length ? (
          <h6 style={{ marginTop: '10rem', textAlign: 'center' }}>
            No chats to show. Please initiate a chat by clicking a pencil icon
            above.
          </h6>
        ) : (
          <ChatMembersList
            currentUser={currentUser}
            chatMembers={chatMembers}
            activeChatMember={activeChatMember}
            setActiveChatMember={setActiveChatMember}
          />
        ))}
      {showTeamList &&
        (teamsPending ? (
          <WarehouseLoader />
        ) : (
          <TeamList
            teams={teams?.map((team) => team.id)}
            handleShowList={(list) => handleShowList(list)}
            setSelectedTeam={setSelectedTeam}
          />
        ))}
      {showUsersList &&
        (teamsPending ? (
          <WarehouseLoader />
        ) : (
          <UsersList
            users={getUsersList(
              teams.find((team) => team.id === selectedTeam),
              currentUser.email
            )}
            handleShowList={(list) => handleShowList(list)}
            handleInitiateChat={handleInitiateChat}
          />
        ))}
    </div>
  );
}

const TeamList = ({ teams, handleShowList, setSelectedTeam }) => {
  return (
    <div className="warehouseChat__leftList">
      <div className="warehouseChat__selectTitle">
        <MdOutlineArrowBackIos
          onClick={() => {
            handleShowList('chatMembersList');
          }}
          style={{ cursor: 'pointer' }}
        />
        <h5>Select Team</h5>
      </div>
      {teams?.map((team) => (
        <div
          onClick={() => {
            setSelectedTeam(team);
            handleShowList('usersList');
          }}
          key={team}
          className={`warehouseChat__user `}
        >
          <span>Team {team}</span>
        </div>
      ))}
    </div>
  );
};

const UsersList = ({ users, handleShowList, handleInitiateChat }) => {
  return (
    <div className="warehouseChat__leftList">
      <div className="warehouseChat__selectTitle">
        <MdOutlineArrowBackIos
          onClick={() => {
            handleShowList('teamList');
          }}
          style={{ cursor: 'pointer' }}
        />
        <h5>Select Member</h5>
      </div>
      {users.map((user) => (
        <div
          key={user}
          onClick={() => handleInitiateChat(user)}
          className={`warehouseChat__user `}
        >
          <img
            src={'/assets/anonymous.png'}
            alt={'chat avatar'}
            className="warehouseChat__userImage"
          />{' '}
          <span>{user}</span>
        </div>
      ))}
    </div>
  );
};

const ChatMembersList = ({
  currentUser,
  chatMembers,
  activeChatMember,
  setActiveChatMember,
}) => {
  const handleMarkAsRead = async (memberEmail) => {
    setActiveChatMember(memberEmail);
    markChatAsRead(`${currentUser.email}/members/${memberEmail}`);
  };

  return (
    <div className="warehouseChat__leftList">
      {chatMembers.map((member) => {
        return (
          <div
            key={member.id}
            onClick={() => {
              handleMarkAsRead(member.id);
            }}
            className={`warehouseChat__user ${
              activeChatMember === member.id && 'active'
            }`}
          >
            <img
              src={'/assets/anonymous.png'}
              alt={'chat avatar'}
              className="warehouseChat__userImage"
            />{' '}
            {!member?.isRead ? (
              <Badge color="success" badgeContent=" ">
                <span>{member.id}</span>
              </Badge>
            ) : (
              <span>{member.id}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
