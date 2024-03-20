import { configureStore, createSlice } from "@reduxjs/toolkit";

const myReducer = createSlice({
  name: "myReducer",
  initialState: {
    users: [],
    departments: [],
    courses: [],
    lessons: [],
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
  },
});

const store = configureStore({
  reducer: {
    myReducer: myReducer.reducer,
  },
});

export const { setUsers, setDepartments, setCourses,setLessons } = myReducer.actions;
export default store;
