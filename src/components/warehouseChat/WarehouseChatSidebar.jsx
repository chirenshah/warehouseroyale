import { useState } from 'react';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
// Components
import WarehouseLoader from '../ui/WarehouseLoader';
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
// Material icons
import { MdModeEdit } from 'react-icons/md';
import { MdOutlineArrowBackIos } from 'react-icons/md';
// Firebase services
import { initiateChat } from '../../Database/firestoreService';
// Helpers
import { getUsersList } from './helpers/getUsersList';
// Constants
import { COLLECTION_TEAMS } from '../../utils/constants';

export default function WarehouseChatSidebar({
  chatMembers,
  chatMembersPending,
  activeChatMember,
  setActiveChatMember,
  loadNewChatMember,
}) {
  const { user: currentUser } = useAuthContext();
  const { response, callFirebaseService } = useFirestore();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showChatMembersList, setShowChatMembersList] = useState(true);
  const [showTeamList, setShowTeamList] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);

  const {
    documents: teams,
    isPending: teamsPending,
    error: teamsError,
  } = useCollection(COLLECTION_TEAMS);

  const handleShowList = (list) => {
    switch (list) {
      case 'chatMemberList':
        setShowChatMembersList(true);
        setShowTeamList(false);
        setShowUsersList(false);
        break;
      case 'teamList':
        setShowChatMembersList(false);
        setShowTeamList(true);
        setShowUsersList(false);
        break;
      case 'usersList':
        setShowChatMembersList(false);
        setShowTeamList(false);
        setShowUsersList(true);
        break;
      default:
        setShowChatMembersList(true);
        setShowTeamList(false);
        setShowUsersList(false);
        break;
    }
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
      {response.error ||
        (teamsError && (
          <WarehouseSnackbar text={response.error || teamsError} />
        ))}
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
        (chatMembersPending || !chatMembers || response.isPending ? (
          <WarehouseLoader />
        ) : !chatMembers.length ? (
          <h6 style={{ marginTop: '10rem', textAlign: 'center' }}>
            No chats to show. Please initiate a chat by clicking a pencil icon
            above.
          </h6>
        ) : (
          <ChatMembersList
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
            users={getUsersList(teams.find((team) => team.id === selectedTeam))}
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
  chatMembers,
  activeChatMember,
  setActiveChatMember,
}) => {
  return (
    <div className="warehouseChat__leftList">
      {chatMembers.map((member) => (
        <div
          key={member.id}
          onClick={() => setActiveChatMember(member.id)}
          className={`warehouseChat__user ${
            activeChatMember === member.id && 'active'
          }`}
        >
          <img
            src={'/assets/anonymous.png'}
            alt={'chat avatar'}
            className="warehouseChat__userImage"
          />{' '}
          <span>{member.id}</span>
        </div>
      ))}
    </div>
  );
};
