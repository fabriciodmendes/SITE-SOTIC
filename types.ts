export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            content: string;
        }[];
    }[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingChunks?: GroundingChunk[];
  timestamp: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}