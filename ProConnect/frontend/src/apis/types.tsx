export type userDetails = {
    email: string,
    entityname: string,
    phone: string,
    location: string,
    abn: string,
    role: string,
    cv_id: string | null,
    img_id: string | null,
    skills: string[],
    company_bio: string
}
export type User = {
    uid: string;
    email: string;
    entityname: string;
    abn: string;
    role: string;
};

export type userProfileProjectStats = {
    activeProjects: number | null,
    completedProjects: number | null,
    averageProjects:number | null

}

export type Cv_information = {
    base64 : string;
    fileName : string;
    contentType: string;
}

export type ProfilePageObject = {
    userDetails : userDetails
    user:User
    userProfileProjectStats : userProfileProjectStats
    Cv_information: Cv_information
    token: string | null
    user_id : string | null| undefined
    avatarUrl : string
    isUsersProfile : boolean
}

export type Setters = {
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>,
    setUserDetail: React.Dispatch<React.SetStateAction<userDetails>>,
    setProjectStatus: React.Dispatch<React.SetStateAction<userProfileProjectStats>>,
    setIsUsersProfile: React.Dispatch<React.SetStateAction<boolean>>,
    setCvData: React.Dispatch<React.SetStateAction<Cv_information>>,
    getUserDetails: () => Promise<void>;
};

export type EditSetters = {
    setEditEmail: React.Dispatch<React.SetStateAction<string>>
    setEditName: React.Dispatch<React.SetStateAction<string>>
    setEditPhone: React.Dispatch<React.SetStateAction<string>>
    setEditLocation: React.Dispatch<React.SetStateAction<string>>
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>
    setNewPassword: React.Dispatch<React.SetStateAction<string>>
    setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>
    setEdit :  (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDiscardEditForm:(event: React.MouseEvent<HTMLButtonElement>) => void;
    onPasswordChangeFn :  (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDiscardPasswordForm:(event: React.MouseEvent<HTMLButtonElement>) => void;
    getUpdatedUserDetails:  () => Promise<void>;
}

export type EditValues = {
    editMail: string
    editPhone: string
    editLocation:string
    editName:string
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}
export type confirmationDialog ={
    title: string;
    content: string;
    cancelButton: string;
    confirmButton: string;
    openStatus: boolean;
    actionFn: () => void;
    onClose: () => void;
    openDialog: () => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type ProjectData = {
    title: string;
    description: string;
    category: string;
    budget: string;
    deadline: string;
    professional_num: string;
    project_type: string;
    project_location: string;
    status: string;
    date_created :string;
    manpower_required :string;
    project_owner: string,
    project_owner_name: string
}

export type AllProjectUsers = {
    applied_users : ProjectUsers[];
    approved_users: ProjectUsers[];
    rejected_users: ProjectUsers[]
}

export type ProjectUsers = {
    user_id:string
    name: string
    email: string
    phone: string
    proposed_deadline: string
    proposal: string
    date_applied : string
}

export type ProjectsData = {
    project_id:string;
    title: string;
    description: string;
    category: string;
    budget: string;
    deadline: string;
    professional_num: string;
    project_type: string;
    project_location: string;
    status: string;
    date_created :string;
    manpower_required :string;
    project_owner: string,
    project_owner_name: string
}

export type Reviews = {
    reviews : ReviewData[]
}

export type ReviewData = {
    user_id : string;
    review_star: string;
    rater_name: string;
    review_message:string;
    review_id: string;
}
