import React, { useState, useRef, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Autocomplete, 
  Chip, 
  IconButton, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  useTheme,
  CircularProgress,
  Stack,
  Alert,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import CakeIcon from '@mui/icons-material/Cake';
import EventIcon from '@mui/icons-material/Event';
import { useAppDispatch } from '../store/hooks';
import { addRecordThunk } from '../store/recordsSlice';
import { RecordFormData } from '../types';

// Навыки для автозаполнения
const AVAILABLE_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 
  'Node.js', 'Python', 'Java', 'C#', 'PHP', 
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'CI/CD', 'Agile', 'Scrum', 'Kanban',
  'Figma', 'Photoshop', 'UI/UX', 'Adobe XD', 'Sketch',
  'QA', 'Testing', 'Selenium', 'Postman', 'Jest',
  'Продажи', 'Переговоры', 'CRM', 'Маркетинг', 'PR'
];

// Языки для автозаполнения
const AVAILABLE_LANGUAGES = [
  'Английский', 'Немецкий', 'Французский', 'Испанский', 'Итальянский',
  'Китайский', 'Японский', 'Корейский', 'Арабский', 'Португальский',
  'Русский', 'Польский', 'Турецкий', 'Голландский', 'Шведский'
];

// Образование
const EDUCATION = [
  'Среднее', 'Среднее специальное', 'Высшее', 'Бакалавр', 
  'Магистр', 'MBA', 'Кандидат наук', 'Доктор наук', 
  'Высшее техническое', 'Высшее экономическое', 'Высшее юридическое', 'Высшее психологическое'
];

// Статусы сотрудников
const STATUSES = ['Активный', 'В отпуске', 'Больничный', 'Удаленная работа'];

// Отделы компании
const DEPARTMENTS = ['IT', 'Дизайн', 'Маркетинг', 'Продажи', 'HR', 'Финансы', 'Аналитика', 'Администрация', 'Разработка', 'Управление'];

interface RecordFormProps {
  onSuccess?: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ onSuccess }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Начальное состояние формы
  const initialFormState: RecordFormData = {
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: undefined,
    startDate: '',
    status: '',
    address: '',
    skills: [],
    birthDate: '',
    education: '',
    languages: [],
    experience: undefined
  };
  
  const [formData, setFormData] = useState<RecordFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof RecordFormData, string>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [minFieldsError, setMinFieldsError] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const filledFieldsCount = useMemo(() => {
    return Object.entries(formData).reduce((count, [key, value]) => {
      if (
        (typeof value === 'string' && value.trim() !== '') ||
        (typeof value === 'number' && value !== 0) ||
        (Array.isArray(value) && value.length > 0)
      ) {
        if (key === 'startDate' && value === initialFormState.startDate) {
          return count;
        }
        if (key === 'status' && value === initialFormState.status) {
          return count;
        }
        
        return count + 1;
      }
      return count;
    }, 0);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormChanged(true);

    if (errors[name as keyof RecordFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormChanged(true);
    
    if (errors[name as keyof RecordFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillsChange = (_: any, newValue: string[]) => {
    const skills = Array.isArray(newValue) ? newValue : [];
    setFormData(prev => ({ ...prev, skills }));
    setFormChanged(true);

    if (skills.length > 0 && errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = value === '' ? undefined : parseInt(value, 10);
    
    setFormData(prev => ({ ...prev, salary: numericValue }));
    setFormChanged(true);
    
    if (errors.salary) {
      setErrors(prev => ({ ...prev, salary: '' }));
    }
  };
  
  // Обработчик изменения опыта работы
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = value === '' ? undefined : parseInt(value, 10);
    
    setFormData(prev => ({ ...prev, experience: numericValue }));
    setFormChanged(true);
  };
  
  // Обработчик изменения языков
  const handleLanguagesChange = (_: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, languages: newValue }));
    setFormChanged(true);
  };
  
  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RecordFormData, string>> = {};
    let isValid = true;
    
    // Проверка минимального количества заполненных полей
    if (filledFieldsCount < 5) {
      // Если заполнено меньше 5 полей, выводим общую ошибку
      setSubmitAttempted(true);
      setMinFieldsError(true);
      return false;
    }
    
    setMinFieldsError(false);
    
    // Базовая валидация формата данных, если поля заполнены
    
    // Проверка email, если он заполнен
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Введите корректный email';
        isValid = false;
      }
    }
    
    // Проверка телефона, если он заполнен
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Формат: +7 (XXX) XXX-XX-XX';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  
  // Отправка формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    // Если форма не была изменена, считаем, что нужно заполнить поля
    if (!formChanged) {
      setMinFieldsError(true);
      return;
    }

    
    if (validateForm()) {
      try {
        // Преобразуем числовые поля из undefined в 0 перед отправкой
        const formDataToSubmit = {
          ...formData,
          salary: formData.salary ?? 0,
          experience: formData.experience ?? 0
        };
        
        setIsAddingRecord(true);
        await dispatch(addRecordThunk(formDataToSubmit)).unwrap();
        
        // Сбрасываем форму и вызываем callback
        setFormData(initialFormState);
        setSubmitAttempted(false);
        setMinFieldsError(false);
        setFormChanged(false);
        setIsAddingRecord(false);
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Ошибка при добавлении записи:', error);
        setIsAddingRecord(false);
      }
    } else {
      console.warn('Форма не прошла валидацию, ошибки:', errors);
    }
  };

  // Форматирование телефона при вводе
  const formatPhoneNumber = (value: string): string => {
    if (!value) return '';
    
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');
    
    // Форматируем по маске +7 (XXX) XXX-XX-XX
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+7 (${digits}`;
    if (digits.length <= 4) return `+7 (${digits.slice(1, 4)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  // Обработчик ввода телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Функция для проверки, заполнено ли поле
  const isFieldFilled = (_fieldName: string, value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  // Общие стили для полей
  const getFieldStyle = (fieldName: string) => {
    const isFilled = isFieldFilled(fieldName, formData[fieldName as keyof RecordFormData]);
    return {
      '& .MuiOutlinedInput-root': {
        backgroundColor: isFilled ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
        transition: 'background-color 0.3s ease',
      },
      '& .MuiInputLabel-root': {
        color: isFilled ? 'success.main' : 'inherit',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isFilled ? 'success.main' : 'inherit',
        borderWidth: isFilled ? 2 : 1,
      }
    };
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        maxWidth: '100%',
        overflow: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="600">
          Добавление новой записи
        </Typography>
        <IconButton onClick={onSuccess} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {submitAttempted && minFieldsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Пожалуйста, заполните минимум 5 любых полей перед сохранением
        </Alert>
      )}
      
      {submitAttempted && errors.skills && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.skills}
        </Alert>
      )}
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography>
          Требуется заполнить минимум 5 любых полей на ваш выбор. Поля, отмеченные звездочкой (*), имеют дополнительную валидацию формата.
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
            Заполнено полей: <strong>{filledFieldsCount}</strong> из минимум 5 необходимых
            {filledFieldsCount < 5 && (
              <span style={{ color: 'orange', marginLeft: '4px' }}>
                (осталось заполнить еще {5 - filledFieldsCount})
              </span>
            )}
          </Typography>
          <Box sx={{ ml: 2, flexGrow: 1, maxWidth: 200 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(filledFieldsCount / 5 * 100, 100)} 
              color={filledFieldsCount >= 5 ? "success" : "primary"}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Box>
      </Alert>
      
      <form onSubmit={handleSubmit} ref={formRef} noValidate>
        <Stack spacing={2}>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            Основная информация
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="ФИО"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color={isFieldFilled('name', formData.name) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('name')}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Email*"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={getFieldStyle('email')}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Телефон*"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                error={!!errors.phone}
                helperText={errors.phone || 'Формат: +7 (XXX) XXX-XX-XX'}
                variant="outlined"
                sx={getFieldStyle('phone')}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Должность"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={!!errors.position}
                helperText={errors.position}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color={isFieldFilled('position', formData.position) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('position')}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <FormControl fullWidth error={!!errors.department} sx={getFieldStyle('department')}>
                <InputLabel id="department-label">Отдел</InputLabel>
                <Select
                  labelId="department-label"
                  name="department"
                  value={formData.department}
                  onChange={handleSelectChange}
                  label="Отдел"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon color={isFieldFilled('department', formData.department) ? "success" : "primary"} />
                    </InputAdornment>
                  }
                >
                  {DEPARTMENTS.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Зарплата (₽)"
                name="salary"
                value={formData.salary === undefined ? '' : formData.salary}
                onChange={handleSalaryChange}
                error={!!errors.salary}
                helperText={errors.salary}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color={isFieldFilled('salary', formData.salary) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('salary')}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Дата начала работы"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
                placeholder="гггг-мм-дд"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color={isFieldFilled('startDate', formData.startDate) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('startDate')}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px' }}>
              <FormControl fullWidth sx={getFieldStyle('status')}>
                <InputLabel
                  id="status-label"
                >
                  Статус
                </InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Статус"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon color={isFieldFilled('status', formData.status) ? "success" : "primary"} />
                    </InputAdornment>
                  }
                  renderValue={(selected) => {

                    return selected;
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Выберите статус</em>
                  </MenuItem>
                  {STATUSES.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
              </FormControl>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            label="Адрес"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            variant="outlined"
            sx={getFieldStyle('address')}
          />
          
          <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
            Квалификация и опыт
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Дата рождения"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon color={isFieldFilled('birthDate', formData.birthDate) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('birthDate')}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px' }}>
              <FormControl fullWidth sx={getFieldStyle('education')}>
                <InputLabel id="education-label">Образование</InputLabel>
                <Select
                  labelId="education-label"
                  name="education"
                  value={formData.education}
                  onChange={handleSelectChange}
                  label="Образование"
                  startAdornment={
                    <InputAdornment position="start">
                      <SchoolIcon color={isFieldFilled('education', formData.education) ? "success" : "primary"} />
                    </InputAdornment>
                  }
                >
                  {EDUCATION.map(edu => (
                    <MenuItem key={edu} value={edu}>{edu}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                label="Опыт работы (лет)"
                name="experience"
                value={formData.experience === undefined ? '' : formData.experience}
                onChange={handleExperienceChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color={isFieldFilled('experience', formData.experience) ? "success" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                sx={getFieldStyle('experience')}
              />
            </Box>
          </Box>
          
          <Autocomplete
            multiple
            id="languages"
            options={AVAILABLE_LANGUAGES}
            value={formData.languages || []}
            onChange={handleLanguagesChange}
            filterSelectedOptions
            disableCloseOnSelect
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  variant="outlined" 
                  color="info"
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Языки"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <LanguageIcon color={isFieldFilled('languages', formData.languages) ? "success" : "primary"} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
                sx={getFieldStyle('languages')}
              />
            )}
          />
          
          <Autocomplete
            multiple
            id="skills"
            options={AVAILABLE_SKILLS}
            value={formData.skills || []}
            onChange={handleSkillsChange}
            filterSelectedOptions
            disableCloseOnSelect
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  variant="outlined" 
                  color="primary"
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Навыки"
                error={!!errors.skills}
                helperText={errors.skills || 'Выберите один или несколько навыков (если заполняете это поле)'}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <CodeIcon color={isFieldFilled('skills', formData.skills) ? "success" : "primary"} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  required: false
                }}
                sx={getFieldStyle('skills')}
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography 
              variant="body2" 
              color={filledFieldsCount >= 5 ? "success.main" : "warning.main"}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              {filledFieldsCount >= 5 ? (
                <>
                  <span role="img" aria-label="check" style={{ marginRight: '4px' }}>✅</span>
                  Можно сохранять!
                </>
              ) : (
                <>
                  <span role="img" aria-label="warning" style={{ marginRight: '4px' }}>⚠️</span>
                  Заполните еще {5 - filledFieldsCount} {5 - filledFieldsCount === 1 ? 'поле' : 5 - filledFieldsCount < 5 ? 'поля' : 'полей'}
                </>
              )}
            </Typography>
            
            <Box sx={{ display: 'flex' }}>
              <Button 
                variant="outlined" 
                onClick={onSuccess} 
                sx={{ mr: 2 }}
                disabled={isAddingRecord}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isAddingRecord || filledFieldsCount < 5}
                endIcon={isAddingRecord ? 
                  <CircularProgress size={20} color="inherit" /> : 
                  filledFieldsCount >= 5 ? <SendIcon /> : null
                }
                sx={{ 
                  opacity: filledFieldsCount < 5 ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    opacity: filledFieldsCount < 5 ? 0.6 : 0.9
                  },
                  '&::after': filledFieldsCount >= 5 ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                    animation: 'pulse 1.5s infinite',
                  } : {},
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'translateX(-100%)',
                    },
                    '100%': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                {isAddingRecord ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default RecordForm;