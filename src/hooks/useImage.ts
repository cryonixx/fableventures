export const useImage = (Name?: string) => {
  const getImage = () => {
    const key = Name?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
    switch (key) {
      case "owl":
        return require("@/assets/images/animals/owl.png");
      case "chicken":
        return require("@/assets/images/animals/chicken.png");
      case "redfox":
      case "fox":
        return require("@/assets/images/animals/fox.png");
      case "turtle":
        return require("@/assets/images/animals/freshwaterturtle.png");
      case "littlered":
        return require("@/assets/images/story/littlered.png");
      case "farmer":
        return require("@/assets/images/story/farmer.png");
      case "grandmother":
        return require("@/assets/images/story/grandma.png");
      case "fablefriends":
      case "the-tale-of-little-red":
      case "the_tale_of_little_red":
      case "the tale of little red":
        // Always use the bookcover for the main story
        return require("@/assets/images/story/BookCover.png");
      default:
        return require("@/assets/images/story/BookCover.png");
    }
  };

  return getImage();
};
