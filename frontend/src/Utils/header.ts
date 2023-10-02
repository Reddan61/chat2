import { compareRegExp } from "./regex";

const headerTitles = [
  {
    regExp: /^\/profile$/,
    text: "Профиль",
  },
  {
    regExp: /^\/users$/,
    text: "Пользователи",
  },
  {
    regExp: /^\/rooms$/,
    text: "Комнаты",
  },
  {
    regExp: /^\/rooms\/[a-z0-9]+$/,
    text: "Сообщения",
  },
];

export const getHeaderTitleByLocation = (pathname: string) => {
  const title = headerTitles.reduce((prev, cur) => {
    const { regExp, text } = cur;

    if (compareRegExp(pathname, regExp)) {
      return text;
    }

    return prev;
  }, null as string | null);

  return title;
};
