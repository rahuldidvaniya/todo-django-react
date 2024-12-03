import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "../utils/toastConfig";
import { api } from "../services/api";
import { useProjects } from '../hooks/useProjects';

export default function EditProjectForm() {
  const { 
    setIsEditFormOpen, 
    projectToEdit, 
    handleProjectUpdate,
    setSelectedProject 
  } = useProjects();
  

  const initialValues = {
    name: projectToEdit.project_name,
    description: projectToEdit.project_description || ""
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Project name is required")
      .min(3, "Project name must be at least 3 characters")
      .max(30, "Project name cannot exceed 50 characters"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description cannot exceed 200 characters")
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.editProject(projectToEdit.project_id, values);
      
      
      if (response) {
        const updatedProject = {
          project_id: projectToEdit.project_id,
          project_name: values.name,
          description: values.description
        };
        console.log("The updated project is", updatedProject);
        handleProjectUpdate(updatedProject);
        setIsEditFormOpen(false);
        setSelectedProject(updatedProject.project_id);
        showToast.success("Project updated successfully! 🎉");
      }
    } catch (error) {
      console.error("There was an error updating the project!", error);
      showToast.error("Failed to update project!");
    }
    setSubmitting(false);
  };

  return (
    <div className="edit-project-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="project-form">
              <h3>Edit Project</h3>
              <div>
                <Field
                  type="text"
                  className="project-input"
                  placeholder="Enter project name"
                  id="name"
                  name="name"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <Field
                  as="textarea"
                  id="description"
                  className="project-input"
                  placeholder="Enter project description"
                  name="description"
                />
                <ErrorMessage name="description" component="div" className="error" />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-add"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Updating..." : "Update Project"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditFormOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
