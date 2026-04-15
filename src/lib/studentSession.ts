const STUDENT_ID_KEY = "student_id";
const STUDENT_NAME_KEY = "user_name";
const STUDENT_GROUP_KEY = "user_group";
const STUDENT_SESSION_TOKEN_KEY = "student_session_token";

export const getStudentSession = () => ({
  studentId: localStorage.getItem(STUDENT_ID_KEY) || "",
  studentName: localStorage.getItem(STUDENT_NAME_KEY) || "",
  studentGroup: localStorage.getItem(STUDENT_GROUP_KEY) || "",
  sessionToken: localStorage.getItem(STUDENT_SESSION_TOKEN_KEY) || "",
});

export const saveStudentSession = ({
  studentId,
  studentName,
  studentGroup,
  sessionToken,
}: {
  studentId: string;
  studentName: string;
  studentGroup: string;
  sessionToken: string;
}) => {
  localStorage.setItem(STUDENT_ID_KEY, studentId);
  localStorage.setItem(STUDENT_NAME_KEY, studentName);
  localStorage.setItem(STUDENT_GROUP_KEY, studentGroup);
  localStorage.setItem(STUDENT_SESSION_TOKEN_KEY, sessionToken);
};

export const clearStudentSession = () => {
  localStorage.removeItem(STUDENT_ID_KEY);
  localStorage.removeItem(STUDENT_NAME_KEY);
  localStorage.removeItem(STUDENT_GROUP_KEY);
  localStorage.removeItem(STUDENT_SESSION_TOKEN_KEY);
};
