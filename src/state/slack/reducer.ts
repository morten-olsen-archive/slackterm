import { Reducer } from 'redux';
import * as actionTypes from './actionTypes';

export interface Channel {
  id: string;
  name: string;
  is_channel: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: boolean;
  user: string;
  creator: string;
  name_normalized: string;
  is_shared: boolean;
  is_org_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  members: string[];
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  }
  previous_names: string[];
  num_members: number;
}

export interface Member {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: any;
  tz_label: string;
  tz_offset: number;
  profile: {
    title: string;
    phone: string;
    skype: string;
    real_name: string;
    real_name_normalized: string;
    display_name: string;
    display_name_normalized: string;
    fields: any;
    status_text: string;
    status_emoji: string;
    status_expiration: number;
    avatar_hash: string;
    always_active: boolean;
    first_name: string;
    last_name: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    status_text_canonical: string;
    team: string;
  }
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
}

export interface Message {
  type: 'message';
  user: string;
  text: string;
  client_msg_id: string;
  team: string;
  channel: string;
  event_ts: string;
  ts: string;
}

export interface Target {

}

export interface SlackState {
  members: Member[];
  channels: Channel[];
  newMessages: Message[];
  selectedConversation?: {
    messages: Message[],
    id: string,
  },
  target?: {
    channel: string;
  },
}

export const createDefaultState = (): SlackState => ({
  members: [],
  channels: [],
  newMessages: [],
  selectedConversation: undefined,
  target: undefined,
});

const slackReducer: Reducer<SlackState> = (state = createDefaultState(), action) => {
  switch (action.type) {
    case actionTypes.SET_CONVERSATIONS: {
      return {
        ...state,
        channels: action.payload,
      };
    }
    case actionTypes.SET_MEMBERS: {
      return {
        ...state,
        members: action.payload,
      };
    }
    case actionTypes.SELECT_CONVERSATION: {
      return {
        ...state,
        selectedConversation: action.payload,
        newMessages: state.newMessages.filter(m => m.channel !== action.payload.id),
        target: {
          channel: action.payload.id,
        },
      }
    }
    case actionTypes.ADD_MESSAGE: {
      return {
        ...state,
        newMessages: [
          ...state.newMessages,
          action.payload,
        ],
        target: {
          channel: action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export default slackReducer;