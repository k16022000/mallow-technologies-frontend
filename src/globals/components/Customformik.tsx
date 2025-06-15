import React, { useEffect, useRef, ReactNode } from "react";
import { Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import { AnySchema } from "yup";
interface CustomFormikProps<T extends FormikValues> {
  children: (
    formikProps: FormikProps<T> & {
      handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
  ) => ReactNode;
  validationSchema?: AnySchema;
  initialValues: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
}

const CustomFormik = <T extends FormikValues>({
  children,
  validationSchema,
  initialValues,
  onSubmit,
  ...formikProps
}: CustomFormikProps<T>) => {
  const submitBtn = useRef<HTMLButtonElement | HTMLInputElement | null>(null);
  const handleValidationWhileSubmit = useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    if (submitBtn.current === null) {
      submitBtn.current =
        document.querySelector('button[type="submit"]') ||
        document.querySelector('input[type="submit"]');

      if (submitBtn.current) {
        submitBtn.current.addEventListener(
          "click",
          handleValidationWhileSubmit.current!
        );
      }
    }

    return () => {
      if (submitBtn.current) {
        submitBtn.current.removeEventListener(
          "click",
          handleValidationWhileSubmit.current!
        );
      }
      submitBtn.current = null;
      handleValidationWhileSubmit.current = null;
    };
  }, []);

  if (typeof children !== "function") return <>{children}</>;

  return (
    <Formik
      {...formikProps}
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formikChildProps) => {
        const { setFieldValue, validateForm } = formikChildProps;

        const handleFileUpload = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const file = event.target.files?.[0];
          const fieldName = event.target.name as keyof T;
          if (file) {
            setFieldValue(fieldName as string, file);
          }
        };

        const fetchErrorFieldName = (errData: unknown, key: string): string => {
          if (typeof errData !== "object" || errData === null) {
            return key;
          }
          const subKey = errData && typeof errData === "object" ? Object.keys(errData)[0] : "";
          return fetchErrorFieldName(
            (errData as Record<string, unknown>)[subKey],
            `${key}.${subKey}`
          );
        };

        if (handleValidationWhileSubmit.current === null) {
          handleValidationWhileSubmit.current = () => {
            validateForm().then((errorObj) => {
              const errorKeyList = Object.keys(errorObj);
              if (errorKeyList.length > 0) {
                const errorFieldName = fetchErrorFieldName(
                  errorObj[errorKeyList[0]],
                  errorKeyList[0]
                );
                if (errorFieldName) {
                  const errorElea = document.getElementsByName(
                    errorFieldName
                  )[0] as HTMLInputElement;
                  const errorEleb = document.querySelector(
                    `[name="${errorFieldName}"]`
                  ) as HTMLInputElement;

                  if (errorElea) {
                    if (errorElea.type !== "hidden") {
                      errorElea.scrollIntoView({ behavior: "smooth" });
                      if (typeof errorElea.focus === "function")
                        errorElea.focus();
                    } else {
                      setTimeout(() => {
                        const fieldContainer = errorElea.closest("div");
                        if (fieldContainer)
                          fieldContainer.scrollIntoView({ behavior: "smooth" });
                      }, 500);
                    }
                  }

                  if (errorEleb) {
                    const textEditorParent = errorEleb.closest(
                      ".custom-text-editor-field"
                    );
                    if (textEditorParent) {
                      const ckEditorInstance =
                        textEditorParent.querySelector(".cke");
                      if (ckEditorInstance) {
                        ckEditorInstance.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        const ckEditorFocus = ckEditorInstance.querySelector(
                          ".cke_editable"
                        ) as HTMLElement;
                        if (ckEditorFocus) {
                          ckEditorFocus.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          ckEditorFocus.focus();
                        }
                      }
                    } else {
                      errorEleb.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      errorEleb.focus();
                    }
                  }
                }
              }
            });
          };
        }

        return children({
          ...formikChildProps,
          handleFileUpload,
        });
      }}
    </Formik>
  );
};

export default CustomFormik;
