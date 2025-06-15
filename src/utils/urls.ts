export type API_PATH = `api/${string}`;

export const urls = {
  logout: "api/user/logout",
  login: "api/user/login",
  signup: "api/user/signup",
  obtain_industry: "api/user/obtain_industry",
  upload_resumes: "api/celery/upload_resumes",
  obtain_job_quotation: "api/job/obtain_job_quotation",
  obtain_skill: "api/user/obtain_skill",
  obtain_work_modes: "api/user/obtain_work_modes",
  obtain_employment_types: "api/user/obtain_employment_types",
  obtain_location: 'api/user/obtain_location',
  obtain_qualifications: 'api/user/obtain_qualifications',
  parse_job_details: 'api/job/parse_job_details',
  save_job: 'api/job/save_job',
  save_prescreening_questions: 'api/job/save_prescreening_questions',
  obtain_jobs: 'api/job/obtain_jobs',
  obtain_job_details: 'api/job/obtain_job_details',
  check_registered_user: "api/candidate/check_registered_user",
  upload_resume: "api/candidate/upload_resume",
  upload_files: "api/candidate/upload_files",
  save_candidate: "api/candidate/save_candidate",
  upload_resources: "api/resources/upload_resources",
  obtain_resources: "api/resources/obtain_resources",
  save_payment_info: "api/payment/save_payment_info",
  update_job_status: "api/job/update_job_status",
  obtain_job_status: "api/job/obtain_job_status",
  obtain_currencies: "api/user/obtain_currencies",
  obtain_candidate: "api/candidate/obtain_candidate",
  obtain_job_screening_questions: "api/job/obtain_job_screening_questions",
  save_job_to_user: "api/candidate/save_job_to_user",
  obtain_user_resumes: "api/candidate/obtain_user_resumes",
} as const satisfies Record<string, API_PATH>;

export const cookieUpdateURLs: Array<API_PATH> = [
  urls.login,
];

export const cookieIgnoredURLs: Array<API_PATH> = [
  urls.logout,
  urls.signup,
  urls.obtain_industry,
  urls.upload_resumes,
];

export type urlName = keyof typeof urls;
