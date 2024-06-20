import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useState, useRef, useEffect } from "react";
import { FormLabel } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import * as ApiService from "../../services/auth";
import Notification, {
    NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import { ClassicEditor } from "../../base-components/Ckeditor";

function Terms() {
    const [loading, isLoading] = useState(false);
    const [success, setSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [privacy_policy, setPrivacyPolicy] = useState("");
    const [terms_conditions, setTermsConditions] = useState("");

    // Success notification
    const notify = useRef<NotificationElement>();
    const {
        register,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange"
    });

    useEffect(() => {
        getPolicy();
    }, []);

    const getPolicy = async (pg = 1) => {
        isLoading(true);
        try {
            // let res = await ApiService.getPolicy();
            // setPrivacyPolicy(res.privacy_policy)
            // setTermsConditions(res.terms_conditions) hello aaron
        } catch (error) {
            isLoading(false);
            console.log("Error fetching feeds");
        }
    };


    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        isLoading(true);
        try {
            const data = await getValues();
            data.privacy_policy = privacy_policy;
            data.terms_conditions = terms_conditions;
            data.privacy_policy_url = data.privacy_policy_url && data.privacy_policy_url[0];
            // let res = await ApiService.updatePolicy(data);
            isLoading(false);
            setSuccess(true);
            // setMessage(res.message);
            notify.current?.showToast();
        } catch (error: any) {
            isLoading(false);
            setSuccess(false);
            setMessage(error.message);
            notify.current?.showToast();
        }
    };

    return (
        <>
            <form
                className="mt-5 p-5 intro-y box validate-form"
                onSubmit={onSubmit}
            >
                <div className="grid grid-cols-12 gap-4 gap-y-3">
                    {/* <div className="col-span-12 sm:col-span-12">
                        <FormLabel>Privacy Policy</FormLabel>
                        <ClassicEditor value={privacy_policy} onChange={setPrivacyPolicy} />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <FormLabel>Privacy Policy Document</FormLabel>
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <input {...register("privacy_policy_url")} type="file" name="privacy_policy_url" />
                    </div> */}
                    <div className="col-span-12 sm:col-span-12">
                        <FormLabel>Terms & Conditions</FormLabel>
                        <ClassicEditor value={terms_conditions} onChange={setTermsConditions} />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <div className="flex items-center mt-2 intro-y">
                            <Button variant="primary" type="submit" className="w-20">
                                Update
                                {loading && (
                                    <LoadingIcon
                                        icon="spinning-circles"
                                        color="white"
                                        className="w-4 h-4 ml-2"
                                    />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {/* END: Delete Confirmation Modal */}
            <Notification
                options={{ duration: 3000 }}
                getRef={(el) => {
                    notify.current = el;
                }}
                className="flex"
            >
                <Lucide
                    icon={success ? "CheckCircle" : "XCircle"}
                    className={success ? "text-success" : "text-danger"}
                />
                <div className="ml-4 mr-4">
                    <div className="font-medium">
                        {success ? "Success" : "Failed"}
                    </div>
                    <div className="mt-1 text-slate-500">{message}</div>
                </div>
            </Notification>
        </>
    );
}
export default Terms;
