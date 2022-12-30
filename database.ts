export interface UserData {
  id: string;
  email: string;
  name: string;
}

export interface UserDataWithPassword extends UserData {
  password: string;
}

interface DB {
  users: UserDataWithPassword[]
}

const db: DB = {
    users: [
      {
        id: "abcde",
        email: "test1@example.com",
        name: "test1",
        password: "1111"
      },
      {
        id: "efghi",
        email: "test2@example.com",
        name: "test2",
        password: "2222"
      },
      {
        id: "xyzdf2",
        email: "test3@example.com",
        name: "test3",
        password: "3333"
      },
      {
        id: "dfsdf3fsdf",
        email: "yusungkim@me.com",
        name: "yusungkim",
        password: "password"
      }
    ]
  }

export default db