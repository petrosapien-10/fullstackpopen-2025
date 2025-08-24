import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";

const baseUrl = "http://localhost:3000";

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export const getAllDiaryEntries = () => {
  return axios
    .get<DiaryEntry[]>(`${baseUrl}/api/diaries`)
    .then((response) => response.data);
};

export const createDiaryEntry = async (object: NewDiaryEntry) => {
  try {
    const response = await axios.post<DiaryEntry>(
      `${baseUrl}/api/diaries`,
      object
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
  return;
};
