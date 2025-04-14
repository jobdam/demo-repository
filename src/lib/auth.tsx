/** @format */

import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import { z } from "zod";

//react-query-auth useAuth 훅을 통해 전역에서 로그인/로그아웃을관리
//react-query를 사용해서 api '유저' 데이터 관리
//로그인 후 사용자 데이터 전역 유지, 자동 refetch도 가능
//자동 refetch란  쿼리를 자동으로 다시 실행해서 최신 데이터를 가져오는것을 말한다.

// import { paths } from '@/config/paths';
// import { AuthResponse, User } from '@/types/api';

import { api } from "./api-client";

const getUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const loginInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(15, "비밀번호는 최대 15자까지 가능합니다.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).*$/,
      "영문자와 특수문자를 모두 포함해야 합니다."
    ),
});
