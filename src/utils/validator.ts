import { FormRule } from 'antd';

// Validator
interface keyValidator {
    required?: any;
    email?: any;
    phone?: any;
    number?: any;
    username?: any;
    password?: any;
    people_name?: any;
    full_name?: any;
}

export const RULES_FORM: Record<keyof keyValidator, FormRule[]> = {
    required: [
        {
            required: true,
            message: 'Không được để trống',
        },
    ],
    email: [
        {
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            message: 'Email không đúng định dạng',
        },
    ],
    phone: [
        {
            min: 10,
            message: 'Số điện thoại tối thiểu 10 ký tự',
        },
        {
            pattern: /^0/gm,
            message: 'Số điện thoại phải bắt đầu bằng 0',
        },
        {
            pattern: /^\d+$/gm,
            message: 'Số điện thoại chỉ chứa ký tự số',
        },
    ],
    number: [
        {
            pattern: /^[0-9]*$/gm,
            message: 'Chỉ được là số',
        },
    ],
    username: [
        {
            pattern: /^[a-zA-Z0-9]{6,10}$/g,
            message:
                'Tài khoản có độ dài 6-10 chữ/số và không chứa khoảng cách và ký tự đặc biệt',
        },
    ],
    password: [
        {
            pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~\\-]).{8,}$/g,
            message:
                'Mật khẩu phải có ít nhất 8 kí tự bao gồm chữ hoa, chữ thường, và ít nhất một kí tự đặc biệt và số',
        },
    ],
    people_name: [
        {
            pattern:
                /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm,
            message:
                'Tên nguời dùng phải bắt đầu bằng chữ in hoa Không bắt đầu và kết thúc bằng dấu cách, không chứa sô và ký tự đặc biệt',
        },
        {
            min: 5,
            message: 'Tên phải tối thiểu 5 ký tự',
        },
    ],
    full_name: [
        {
            required: true,
            message: 'Không được để trống',
        },
        {
            pattern: /^[a-zA-Z ]+$/gm,
            message:
                'Tên nguời dùng không chứa ký tự số, không chứa ký tự đặc biệt',
        }
    ]
};
