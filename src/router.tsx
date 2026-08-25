import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // הכתובת הקנונית היא בלי סלאש סוגר. בלי זה הראוטר מוסיף סלאש לקישורי
    // הסיפורים, וכל אחד מהם עולה בהפניית 301 לסורק שעוקב אחריו.
    trailingSlash: "never",
  });

  return router;
};
