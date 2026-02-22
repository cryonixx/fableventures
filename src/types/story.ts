export interface Node {
  type: "narrator" | "dialogue" | "choice" | "minigame";
  text?: string;
  character?: string;
  options?: string[];
  minigame_id?: string;
  description?: string;
}

export interface Scene {
  id: string;
  title: string;
  animal?: string;
  type?: string;
  minigame_id?: string;
  description?: string;
  nodes: Node[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  scenes: Scene[];
}

export interface Story {
  title: string;
  sections: Chapter[];
}

export interface ChildStoryProgress {
  child_id: number;
  story_id: string;
  current_chapter_id: string;
  current_scene_id: string;
  current_node_index: number;
  completed_chapters: string[];
  collected_animals: string[];
  last_updated: string;
}

export interface CollectedAnimal {
  child_id: number;
  animal_name: string;
  collected_from_story: string;
  collected_from_scene: string;
  date_collected: string;
}
