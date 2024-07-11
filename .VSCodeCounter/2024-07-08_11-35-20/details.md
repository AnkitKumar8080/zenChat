# Details

Date : 2024-07-08 11:35:20

Directory /home/ankit/Projects/zenChat

Total : 87 files,  13962 codes, 392 comments, 794 blanks, all 15148 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 108 | 0 | 58 | 166 |
| [backend/.dockerignore](/backend/.dockerignore) | Ignore | 2 | 0 | 0 | 2 |
| [backend/Dockerfile](/backend/Dockerfile) | Docker | 13 | 1 | 11 | 25 |
| [backend/package-lock.json](/backend/package-lock.json) | JSON | 3,332 | 0 | 1 | 3,333 |
| [backend/package.json](/backend/package.json) | JSON | 60 | 0 | 1 | 61 |
| [backend/src/app.ts](/backend/src/app.ts) | TypeScript | 85 | 12 | 16 | 113 |
| [backend/src/config.ts](/backend/src/config.ts) | TypeScript | 20 | 0 | 6 | 26 |
| [backend/src/constants/index.ts](/backend/src/constants/index.ts) | TypeScript | 13 | 0 | 1 | 14 |
| [backend/src/controllers/auth/authUtils.ts](/backend/src/controllers/auth/authUtils.ts) | TypeScript | 50 | 0 | 11 | 61 |
| [backend/src/controllers/chat.controller.ts](/backend/src/controllers/chat.controller.ts) | TypeScript | 239 | 41 | 63 | 343 |
| [backend/src/controllers/message.controller.ts](/backend/src/controllers/message.controller.ts) | TypeScript | 165 | 19 | 39 | 223 |
| [backend/src/controllers/user.controller.ts](/backend/src/controllers/user.controller.ts) | TypeScript | 70 | 4 | 21 | 95 |
| [backend/src/core/ApiError.ts](/backend/src/core/ApiError.ts) | TypeScript | 107 | 1 | 19 | 127 |
| [backend/src/core/ApiResponse.ts](/backend/src/core/ApiResponse.ts) | TypeScript | 105 | 5 | 20 | 130 |
| [backend/src/core/JWT.ts](/backend/src/core/JWT.ts) | TypeScript | 67 | 4 | 9 | 80 |
| [backend/src/database/index.ts](/backend/src/database/index.ts) | TypeScript | 42 | 5 | 10 | 57 |
| [backend/src/database/model/Chat.ts](/backend/src/database/model/Chat.ts) | TypeScript | 53 | 2 | 12 | 67 |
| [backend/src/database/model/Message.ts](/backend/src/database/model/Message.ts) | TypeScript | 55 | 2 | 8 | 65 |
| [backend/src/database/model/Role.ts](/backend/src/database/model/Role.ts) | TypeScript | 24 | 1 | 7 | 32 |
| [backend/src/database/model/User.ts](/backend/src/database/model/User.ts) | TypeScript | 70 | 2 | 14 | 86 |
| [backend/src/database/repositories/chatRepo.ts](/backend/src/database/repositories/chatRepo.ts) | TypeScript | 168 | 13 | 12 | 193 |
| [backend/src/database/repositories/messageRepo.ts](/backend/src/database/repositories/messageRepo.ts) | TypeScript | 100 | 9 | 11 | 120 |
| [backend/src/database/repositories/userRepo.ts](/backend/src/database/repositories/userRepo.ts) | TypeScript | 125 | 10 | 16 | 151 |
| [backend/src/helpers/asyncHandler.ts](/backend/src/helpers/asyncHandler.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [backend/src/helpers/colorsUtils.ts](/backend/src/helpers/colorsUtils.ts) | TypeScript | 33 | 3 | 5 | 41 |
| [backend/src/helpers/utils.ts](/backend/src/helpers/utils.ts) | TypeScript | 21 | 1 | 5 | 27 |
| [backend/src/middlewares/auth.middlewares.ts](/backend/src/middlewares/auth.middlewares.ts) | TypeScript | 37 | 0 | 7 | 44 |
| [backend/src/middlewares/multer.middlwares.ts](/backend/src/middlewares/multer.middlwares.ts) | TypeScript | 33 | 3 | 5 | 41 |
| [backend/src/routes/chat.routes.ts](/backend/src/routes/chat.routes.ts) | TypeScript | 35 | 7 | 9 | 51 |
| [backend/src/routes/message.routes.ts](/backend/src/routes/message.routes.ts) | TypeScript | 27 | 1 | 7 | 35 |
| [backend/src/routes/user.routes.ts](/backend/src/routes/user.routes.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [backend/src/seeds/seedRoles.ts](/backend/src/seeds/seedRoles.ts) | TypeScript | 24 | 0 | 4 | 28 |
| [backend/src/server.ts](/backend/src/server.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [backend/src/socket/index.ts](/backend/src/socket/index.ts) | TypeScript | 79 | 9 | 15 | 103 |
| [backend/src/types/app-request.d.ts](/backend/src/types/app-request.d.ts) | TypeScript | 6 | 0 | 2 | 8 |
| [backend/src/types/index.ts](/backend/src/types/index.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [backend/src/validators/groupChat.validator.ts](/backend/src/validators/groupChat.validator.ts) | TypeScript | 23 | 0 | 3 | 26 |
| [backend/src/validators/messages.validator.ts](/backend/src/validators/messages.validator.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [backend/src/validators/mongoId.validator.ts](/backend/src/validators/mongoId.validator.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [backend/src/validators/user.validators.ts](/backend/src/validators/user.validators.ts) | TypeScript | 33 | 0 | 6 | 39 |
| [backend/src/validators/validate.ts](/backend/src/validators/validate.ts) | TypeScript | 21 | 3 | 6 | 30 |
| [backend/tsconfig.json](/backend/tsconfig.json) | JSON with Comments | 24 | 24 | 2 | 50 |
| [client/.eslintrc.cjs](/client/.eslintrc.cjs) | JavaScript | 21 | 0 | 1 | 22 |
| [client/Dockerfile](/client/Dockerfile) | Docker | 11 | 2 | 19 | 32 |
| [client/README.md](/client/README.md) | Markdown | 5 | 0 | 4 | 9 |
| [client/index.html](/client/index.html) | HTML | 13 | 0 | 1 | 14 |
| [client/nginxDefault.conf](/client/nginxDefault.conf) | Properties | 14 | 24 | 8 | 46 |
| [client/package-lock.json](/client/package-lock.json) | JSON | 5,922 | 0 | 1 | 5,923 |
| [client/package.json](/client/package.json) | JSON | 38 | 0 | 1 | 39 |
| [client/postcss.config.js](/client/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [client/public/logo.svg](/client/public/logo.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/App.jsx](/client/src/App.jsx) | JavaScript JSX | 68 | 1 | 5 | 74 |
| [client/src/api/index.js](/client/src/api/index.js) | JavaScript | 62 | 11 | 17 | 90 |
| [client/src/assets/index.js](/client/src/assets/index.js) | JavaScript | 65 | 1 | 4 | 70 |
| [client/src/assets/svgs/logo.svg](/client/src/assets/svgs/logo.svg) | XML | 1 | 0 | 0 | 1 |
| [client/src/components/AddChat.jsx](/client/src/components/AddChat.jsx) | JavaScript JSX | 274 | 10 | 16 | 300 |
| [client/src/components/ChatLeftSidebar.jsx](/client/src/components/ChatLeftSidebar.jsx) | JavaScript JSX | 23 | 0 | 3 | 26 |
| [client/src/components/ChatsSection.jsx](/client/src/components/ChatsSection.jsx) | JavaScript JSX | 281 | 27 | 17 | 325 |
| [client/src/components/DesktopOnly.jsx](/client/src/components/DesktopOnly.jsx) | JavaScript JSX | 8 | 0 | 2 | 10 |
| [client/src/components/IncomingCall.jsx](/client/src/components/IncomingCall.jsx) | JavaScript JSX | 48 | 0 | 3 | 51 |
| [client/src/components/Loading.jsx](/client/src/components/Loading.jsx) | JavaScript JSX | 36 | 0 | 3 | 39 |
| [client/src/components/PopupAlert.jsx](/client/src/components/PopupAlert.jsx) | JavaScript JSX | 26 | 0 | 5 | 31 |
| [client/src/components/PrivateRoute.jsx](/client/src/components/PrivateRoute.jsx) | JavaScript JSX | 10 | 2 | 4 | 16 |
| [client/src/components/ProfileSidebar.jsx](/client/src/components/ProfileSidebar.jsx) | JavaScript JSX | 62 | 0 | 8 | 70 |
| [client/src/components/PublicRoute.jsx](/client/src/components/PublicRoute.jsx) | JavaScript JSX | 10 | 2 | 4 | 16 |
| [client/src/components/RecentChatsSidebar.jsx](/client/src/components/RecentChatsSidebar.jsx) | JavaScript JSX | 100 | 1 | 10 | 111 |
| [client/src/components/RecentUserChatCard.jsx](/client/src/components/RecentUserChatCard.jsx) | JavaScript JSX | 70 | 4 | 4 | 78 |
| [client/src/components/SearchUserSidebar.jsx](/client/src/components/SearchUserSidebar.jsx) | JavaScript JSX | 97 | 1 | 10 | 108 |
| [client/src/components/SideMenu.jsx](/client/src/components/SideMenu.jsx) | JavaScript JSX | 50 | 0 | 4 | 54 |
| [client/src/components/ThemeSwitchButton.jsx](/client/src/components/ThemeSwitchButton.jsx) | JavaScript JSX | 14 | 0 | 4 | 18 |
| [client/src/components/VideoChat.jsx](/client/src/components/VideoChat.jsx) | JavaScript JSX | 66 | 1 | 5 | 72 |
| [client/src/context/AuthContext.jsx](/client/src/context/AuthContext.jsx) | JavaScript JSX | 82 | 21 | 15 | 118 |
| [client/src/context/ChatContext.jsx](/client/src/context/ChatContext.jsx) | JavaScript JSX | 192 | 40 | 33 | 265 |
| [client/src/context/SocketContext.jsx](/client/src/context/SocketContext.jsx) | JavaScript JSX | 42 | 4 | 11 | 57 |
| [client/src/context/ThemeContext.jsx](/client/src/context/ThemeContext.jsx) | JavaScript JSX | 7 | 0 | 4 | 11 |
| [client/src/context/ThemeContextWrapper.jsx](/client/src/context/ThemeContextWrapper.jsx) | JavaScript JSX | 20 | 0 | 5 | 25 |
| [client/src/context/WebRtcContext.jsx](/client/src/context/WebRtcContext.jsx) | JavaScript JSX | 253 | 32 | 40 | 325 |
| [client/src/index.css](/client/src/index.css) | CSS | 52 | 5 | 13 | 70 |
| [client/src/main.jsx](/client/src/main.jsx) | JavaScript JSX | 20 | 0 | 2 | 22 |
| [client/src/pages/Chat.jsx](/client/src/pages/Chat.jsx) | JavaScript JSX | 45 | 0 | 4 | 49 |
| [client/src/pages/Login.jsx](/client/src/pages/Login.jsx) | JavaScript JSX | 83 | 2 | 11 | 96 |
| [client/src/pages/Register.jsx](/client/src/pages/Register.jsx) | JavaScript JSX | 90 | 2 | 10 | 102 |
| [client/src/utils/index.js](/client/src/utils/index.js) | JavaScript | 78 | 15 | 14 | 107 |
| [client/tailwind.config.js](/client/tailwind.config.js) | JavaScript | 28 | 1 | 3 | 32 |
| [client/vercel.json](/client/vercel.json) | JSON | 8 | 0 | 1 | 9 |
| [client/vite.config.js](/client/vite.config.js) | JavaScript | 5 | 1 | 2 | 8 |
| [docker-compose.yml](/docker-compose.yml) | YAML | 32 | 0 | 5 | 37 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)