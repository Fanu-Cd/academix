import { configureStore, createSlice } from "@reduxjs/toolkit";

const myReducer = createSlice({
  name: "myReducer",
  initialState: {
    users: [],
    departments: [],
    courses: [],
    lessons: [],
    courseRegs: [],
    exams: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },
    setCourseRegs: (state, action) => {
      state.courseRegs = action.payload;
    },
    setExams: (state, action) => {
      state.exams = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    myReducer: myReducer.reducer,
  },
});

export const {
  setUsers,
  setDepartments,
  setCourses,
  setLessons,
  setCourseRegs,
  setExams
} = myReducer.actions;
export default store;
