import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { Form as FormikForm } from 'formik';
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material';
import './styles/CustomFormComponents.scss';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { selectionOption } from "@utils/types"

const Form: React.FC<{ children: React.ReactNode, [key: string]: unknown }> = ({ children, ...rest }) => {
  return <FormikForm {...rest}>{children}</FormikForm>;
}

const FormGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Box className="custom-form-group">{children}</Box>;
}

interface FormFieldProps {
  error?: string | boolean;
  label?: string;
  fluid?: boolean;
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local' | 'password' | 'url' | 'phone';
  onChange?: (event: { target: { name: string; value: string | number } }) => void;
  size?: 'small' | 'medium';
  value?: string | number;
  spinnerHidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

type PhoneInuptValue = string | null | undefined;

const FormField: React.FC<FormFieldProps> = (props) => {
  const {
    error = false,
    label = '',
    fluid = true,
    type = 'text',
    size = 'medium',
    value = '',
    onChange = () => {},
    spinnerHidden = true,
    required = false,
    disabled = false,
    ...rest
  } = props;

  const getValue = (): string => {
    if (type.toLowerCase() === 'date') return moment(value).format('yyyy-MM-DD');
    if (type.toLowerCase() === 'time') return moment(value).format('HH:mm');
    if (type.toLowerCase() === 'datetime-local') return moment(value).format('yyyy-MM-DDTHH:mm');
    return String(value);
  };

  return (
    <Box className="custom-form-field">
      <Box
        className={error ? 'custom-form-field-label-error' : 'custom-form-field-label'}
      >
        <div>
          {label}
          {required && <span className="custom-required-mark" />}
        </div>
      </Box>

      {(type.toLowerCase() === 'phone') ? (
        <PhoneInput
          value={getValue() as PhoneInuptValue}
          disabled={disabled}
          enableSearch
          country={"in"}
          countryCodeEditable={false}
          onChange={(val) => {
            onChange({ target: { name: rest.name as string, value: val || '' } });
          }}
        />
      ) : (
        <TextField
          type={type}
          size={size}
          required={required}
          disabled={disabled}
          value={getValue()}
          onKeyDown={(e) => {
            if (type.toLowerCase() === 'number') {
              const key = e.key;
              if (
                (key >= '0' && key <= '9') ||
                key === 'Backspace' ||
                key === 'Delete' ||
                key === 'ArrowLeft' ||
                key === 'ArrowRight' ||
                key === 'ArrowUp' ||
                key === 'ArrowDown' ||
                key === 'Enter' ||
                (key === '.' && value?.toString().includes && !value?.toString().includes('.')) ||
                (key === '-' && value?.toString().length === 0)
              ) {
                return true;
              } else {
                e.preventDefault();
                return false;
              }
            }
          }}
          onChange={onChange}
          className={`${error ? 'custom-error-field' : 'custom-form-field'} ${type.toLowerCase() === 'number' && spinnerHidden ? 'no-spinner' : ''}`}
          fullWidth={fluid}
          {...rest}
        />
      )}

      {error && <div className="custom-form-field-error">{error}</div>}
    </Box>
  );
};

export interface SelectionFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fluid?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium';
  value: string | number | (string | number)[];
  options: selectionOption[];
  loading?: boolean;
  error?: boolean | string;
  onChange: (event: {
    target: {
      name: string;
      value: string | string[];
    };
  }) => void;
  onInputChange?: (value: string) => void;
  addOptionComponent?: React.ReactNode;
  [any: string]: unknown;
}

const SelectionField: React.FC<SelectionFieldProps> = (props) => {
  const {
    name,
    label = '',
    placeholder = '',
    required = false,
    fluid = true,
    multiple = false,
    size = 'small',
    value = multiple ? [] : '',
    options = [],
    loading = false,
    error = false,
    onChange,
    onInputChange,
    addOptionComponent = null,
    ...rest
  } = props;

  const [selectedOptions, setSelectedOptions] = useState<selectionOption[]>([]);

  const mergedOptions = useMemo(() => {
    const allOptions = [...options, ...selectedOptions];
    const uniqueOptions = allOptions.filter(
      (opt, index, self) =>
        index === self.findIndex((o) => String(o.value) === String(opt.value))
    );
    return uniqueOptions;
  }, [options, selectedOptions]);

  const findOption = (val: string | number): selectionOption => {
    return (
      options.find((opt) => String(opt.value) === String(val)) ||
      selectedOptions.find((opt) => String(opt.value) === String(val)) || {
        label: '',
        value: val,
        key: val
      }
    );
  };

  const fieldValue = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return value.map(findOption);
    }
    return findOption(value as string | number);
  }, [value, options, selectedOptions]);

  const handleChange = (
    _e: SyntheticEvent,
    selectedOption: selectionOption | selectionOption[] | null
  ) => {
    if (multiple && Array.isArray(selectedOption)) {
      const selectedValues = selectedOption.map((option) => String(option?.value || ''));
      onChange({ target: { name, value: selectedValues } });
      setSelectedOptions(selectedOption);
    } else if (selectedOption && !Array.isArray(selectedOption)) {
      const selectedValue = String(selectedOption.value || '');
      onChange({ target: { name, value: selectedValue } });
      setSelectedOptions([selectedOption]);
    } else {
      onChange({ target: { name, value: '' } });
      setSelectedOptions([]);
    }
  };

  useEffect(() => {
    const synced = (multiple && Array.isArray(value) ? value : [value])
      .flat()
      .filter((val): val is string | number => typeof val === 'string' || typeof val === 'number')
      .map((val) => findOption(val));
    setSelectedOptions(synced);
  }, [value, options]);

  return (
    <Box className="custom-form-field">
      <Box className={error ? 'custom-form-field-label-error' : 'custom-form-field-label'}>
        <div>
          {label}
          {required && <span className="custom-required-mark" />}
        </div>
        <div>{addOptionComponent}</div>
      </Box>

      <Autocomplete
        options={mergedOptions}
        loading={loading}
        multiple={multiple}
        fullWidth={fluid}
        size={size}
        value={fieldValue}
        // filterOptions={(x) => x}
        onChange={handleChange}
        // isOptionEqualToValue={(option, val) =>
        //   String(option.value) === String(val.value)
        // }
        // getOptionLabel={(option) => option?.label || ''}
        // onInputChange={(_e, val) => onInputChange?.(val)}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            error={!!error}
            placeholder={placeholder}
            size={size}
          />
        )}
        sx={{ marginBottom: 0 }}
        {...rest}
      />

      {error && typeof error === 'string' && (
        <div className="custom-form-field-error">{error}</div>
      )}
    </Box>
  );
};

interface CheckBoxFieldProps {
  label?: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (event: { target: { name: string; value: boolean } }) => void;
  name?: string;
  [key: string]: unknown;
}

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  label = '',
  value = false,
  disabled = false,
  onChange = () => { },
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (onChange) {
      onChange({ target: { name: event.target.name, value: checked } });
    }
  };

  return (
    <Box className="custom-checkbox-field">
      <Checkbox
        checked={value}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <Box
        // variant="body1"
        className="custom-form-field-label"
      >
        <div>{label}</div>
      </Box>
    </Box>
  );
};

export {
  CheckBoxField,
  Form,
  FormGroup,
  FormField,
  SelectionField,
};
