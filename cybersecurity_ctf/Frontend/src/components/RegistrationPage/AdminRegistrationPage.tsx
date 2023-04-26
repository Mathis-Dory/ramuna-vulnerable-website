import React, { FC } from "react";
interface AdminRegistrationPageProps {}

const AdminRegistrationPage: FC<AdminRegistrationPageProps> = () => {
    return (
        <div className="hero min-h-screen bg-primary">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="p-12 m-12">
                    <h1 className="text-5xl font-bold text-secondary">
                        Admin panel is currently under construction.
                    </h1>
                </div>
            </div>
        </div>);
};

export default AdminRegistrationPage;
