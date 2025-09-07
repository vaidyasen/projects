import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { resumeAPI } from "../services/api";
import Navbar from "../components/Navbar";

const ResumeForm = () => {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      personal_details: {
        full_name: "",
        email: "",
        phone: "",
        location: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const fetchResume = useCallback(async () => {
    try {
      const response = await resumeAPI.getById(id);
      const resume = response.data;

      // Convert skills array to the format expected by useFieldArray
      const skillsArray = resume.skills.map((skill) => ({ value: skill }));

      reset({
        ...resume,
        skills: skillsArray,
      });
    } catch (error) {
      toast.error("Failed to fetch resume");
      navigate("/dashboard");
    }
  }, [id, reset, navigate]);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchResume();
    }
  }, [id, fetchResume]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert skills back to simple array
      const skillsArray = data.skills.map((skill) => skill.value);

      const resumeData = {
        ...data,
        skills: skillsArray,
      };

      if (isEdit) {
        await resumeAPI.update(id, resumeData);
        toast.success("Resume updated successfully");
      } else {
        await resumeAPI.create(resumeData);
        toast.success("Resume created successfully");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update resume" : "Failed to create resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEdit ? "Edit Resume" : "Create New Resume"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Basic details about your resume.
                  </p>
                </div>
                <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Resume Title
                    </label>
                    <input
                      {...register("title", {
                        required: "Resume title is required",
                      })}
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g., Software Engineer Resume"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Personal Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your personal information and contact details.
                  </p>
                </div>
                <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        {...register("personal_details.full_name", {
                          required: "Full name is required",
                        })}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      {errors.personal_details?.full_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.personal_details.full_name.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        {...register("personal_details.email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                      {errors.personal_details?.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.personal_details.email.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        {...register("personal_details.phone")}
                        type="tel"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        {...register("personal_details.location")}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Professional Summary
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    A brief overview of your professional background.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <textarea
                    {...register("summary")}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Write a brief summary of your professional background and key achievements..."
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Work Experience
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your professional work experience.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                  {experienceFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Experience #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Company
                          </label>
                          <input
                            {...register(`experience.${index}.company`, {
                              required: "Company is required",
                            })}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Position
                          </label>
                          <input
                            {...register(`experience.${index}.position`, {
                              required: "Position is required",
                            })}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            {...register(`experience.${index}.start_date`, {
                              required: "Start date is required",
                            })}
                            type="month"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            {...register(`experience.${index}.end_date`)}
                            type="month"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            {...register(`experience.${index}.location`)}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            {...register(`experience.${index}.description`, {
                              required: "Description is required",
                            })}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      appendExperience({
                        company: "",
                        position: "",
                        start_date: "",
                        end_date: "",
                        location: "",
                        description: "",
                      })
                    }
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Education
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your educational background.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                  {educationFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Education #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Institution
                          </label>
                          <input
                            {...register(`education.${index}.institution`, {
                              required: "Institution is required",
                            })}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Degree
                          </label>
                          <input
                            {...register(`education.${index}.degree`, {
                              required: "Degree is required",
                            })}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., Bachelor of Science"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Field of Study
                          </label>
                          <input
                            {...register(`education.${index}.field_of_study`, {
                              required: "Field of study is required",
                            })}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            {...register(`education.${index}.start_date`, {
                              required: "Start date is required",
                            })}
                            type="month"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            {...register(`education.${index}.end_date`)}
                            type="month"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Grade
                          </label>
                          <input
                            {...register(`education.${index}.grade`)}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., 3.8 GPA, First Class"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      appendEducation({
                        institution: "",
                        degree: "",
                        field_of_study: "",
                        start_date: "",
                        end_date: "",
                        grade: "",
                      })
                    }
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Add Education
                  </button>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Skills
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your technical and professional skills.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-4">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        {...register(`skills.${index}.value`, {
                          required: "Skill is required",
                        })}
                        type="text"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g., JavaScript, Project Management"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendSkill({ value: "" })}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Resume"
                  : "Create Resume"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
