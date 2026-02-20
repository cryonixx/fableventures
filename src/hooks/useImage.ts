export const useImage = (Name?: string) => {
  const getImage = () => {
    switch (Name?.toLowerCase()) {
      case "owl":
        return require("@/assets/images/animals/owl.png");
      case "chicken":
        return require("@/assets/images/animals/chicken.png");
      case "red fox":
      case "fox":
        return require("@/assets/images/animals/fox.png");
      case "turtle":
        return require("@/assets/images/animals/freshwaterturtle.png");
      case "little red":
        return require("@/assets/images/story/littlered.png");
      case "farmer":
        return require("@/assets/images/story/farmer.png");
      case "grandmother":
        return require("@/assets/images/story/grandma.png");
      default:
        return require("@/assets/images/story/BookCover.png");
    }
  };

  return getImage();
};
