/**
 * Step 2: 기본 정보 입력 컴포넌트
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "@/lib/validation/saju-input";
import { z } from "zod";

type BasicInfoData = z.infer<typeof step2Schema>;

interface BasicInfoFormProps {
  value: BasicInfoData | null;
  onChange: (data: BasicInfoData) => void;
  onNext: () => void;
}

export function BasicInfoForm({ value, onChange, onNext }: BasicInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BasicInfoData>({
    resolver: zodResolver(step2Schema),
    defaultValues: value || {
      name: "",
      gender: "male",
    },
  });

  const onSubmit = (data: BasicInfoData) => {
    onChange(data);
    onNext();
  };

  const selectedGender = watch("gender");

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">기본 정보를 입력해주세요</h2>
        <p className="text-gray-600">이름과 성별을 알려주세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="홍길동"
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${
                errors.name
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray-200 focus:border-purple-500"
              }
              focus:outline-none focus:ring-4
              ${errors.name ? "focus:ring-red-100" : "focus:ring-purple-100"}
            `}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            성별
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`
                relative cursor-pointer p-4 rounded-lg border-2 transition-all
                ${
                  selectedGender === "male"
                    ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                {...register("gender")}
                value="male"
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-3xl mb-2">👨</div>
                <span
                  className={`font-medium ${
                    selectedGender === "male"
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  남성
                </span>
              </div>
              {selectedGender === "male" && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </label>

            <label
              className={`
                relative cursor-pointer p-4 rounded-lg border-2 transition-all
                ${
                  selectedGender === "female"
                    ? "border-pink-500 bg-pink-50 ring-4 ring-pink-100"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                {...register("gender")}
                value="female"
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-3xl mb-2">👩</div>
                <span
                  className={`font-medium ${
                    selectedGender === "female"
                      ? "text-pink-700"
                      : "text-gray-700"
                  }`}
                >
                  여성
                </span>
              </div>
              {selectedGender === "female" && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          다음 단계로
        </button>
      </form>
    </div>
  );
}
