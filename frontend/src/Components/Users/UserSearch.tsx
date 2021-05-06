import { Field, Form, Formik } from "formik"
import React from "react"
import { renderTextField } from "../Formik/Fields/Fields"
import { IgetUsers } from "../Redux/Reducers/usersReducer";

interface IProps {
    getUsers: ({}:IgetUsers) => void
}

const UserSearch:React.FC<IProps> = (props) => {
    let timeOut:ReturnType<typeof setTimeout>;
    const submit = (values: {search:string}, { setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            props.getUsers({search : values.search.trim()});
        },1000 )
    }
    return  <Formik
            initialValues = {{search:""}}
            onSubmit = {submit}
        >
            {({handleChange,submitForm}) => <Form>
                    <Field
                        fullWidth
                        margin="dense"
                        label="Search"
                        type="text"
                        name="search"
                        component={renderTextField}
                        onChange = {(e:any) => {
                            handleChange(e);
                            submitForm()
                        }}
                    />
                </Form>
            }
        </Formik>
}


export default UserSearch;