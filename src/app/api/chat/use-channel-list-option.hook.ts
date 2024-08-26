import { AscDesc } from "stream-chat";

import { useSession } from "@core/app-provider";

// TODO: WARNING
// Ở đây use client nhưng lại gọi được query về BE
// Nếu user bằng cách nào đó modified được thì trên server có chặn ko
// Hay data user này ko quá quan trọng
export const useChannelListOption = () => {
  const { user } = useSession();

  // https://getstream.io/chat/docs/sdk/react/components/core-components/channel_list/#basic-usage
  const channelProps = {
    filters: {
      type: "messaging",
      members: { $in: [user.id] },
    },
    options: {
      state: true,
      presence: true,
      limit: 8,
    },
    sort: {
      last_message_at: -1 as AscDesc,
    },
  };

  // https://getstream.io/chat/docs/sdk/react/components/utility-components/channel_search/#customizing-the-search-method
  // https://getstream.io/chat/docs/sdk/react/components/utility-components/channel_search/#searchqueryparams-2

  // https://getstream.io/chat/docs/sdk/react/components/core-components/channel_list/#customquerychannels-1
  // Channel ở đây có thể là user / group chat
  // Nhưng chỉ cho search các channel mà user đã tham gia!!
  const additionalChannelSearchProps = {
    searchForChannels: true,
    searchQueryParams: {
      channelFilters: {
        filters: { members: { $in: [user.id] } },
      },
    },
  };

  return { channelProps, additionalChannelSearchProps };
};
