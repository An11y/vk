import React, {useEffect, useRef, useState} from 'react';
import {Record} from '../types';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  LinearProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchRecordsThunk, 
  selectAllRecords, 
  selectRecordsStatus, 
  selectHasNextPage 
} from '../store/recordsSlice';

type SortOrder = 'asc' | 'desc';
type SortKey = keyof Record | '';

const RecordsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAllRecords);
  const status = useAppSelector(selectRecordsStatus);
  const hasNextPage = useAppSelector(selectHasNextPage);
  
  const isLoading = status === 'loading';
  const isError = status === 'failed';
  const isFetchingNextPage = false;

  const loaderRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchRecordsThunk({ _page: 1, _limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isLoading) {
          dispatch(fetchRecordsThunk({ _page: 2, _limit: 10 }));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [dispatch, hasNextPage, isLoading]);
  if (isError) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
        <Typography variant="h6">Ошибка при загрузке данных</Typography>
        <Typography variant="body1">Пожалуйста, попробуйте обновить страницу</Typography>
      </Card>
    );
  }

  const getColumnKeys = (data: Record[]): string[] => {
    if (!data.length) return [];

    const keysWithValues: {[key: string]: number} = {};
    
    data.forEach(record => {
      Object.entries(record).forEach(([key, value]) => {
        if (key !== 'id' && hasValue(value)) {
          keysWithValues[key] = (keysWithValues[key] || 0) + 1;
        }
      });
    });
    
    return Object.keys(keysWithValues);
  };

  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'number') return value !== 0;
    return true;
  };

  const columnKeys = getColumnKeys(records);

  const formatCellValue = (record: Record, key: string): React.ReactNode => {
    const value = record[key as keyof Record];
    
    if (!hasValue(value)) {
      return '';
    }
    
    if (Array.isArray(value)) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value.map((item, index) => (
            <Chip key={index} label={item} size="small" variant="outlined" sx={{ 
              borderRadius: '4px',
              transition: 'all 0.2s',
              '&:hover': { 
                bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                color: theme.palette.mode === 'dark' ? 'white' : 'primary.dark',
              }
            }} />
          ))}
        </Box>
      );
    }

    if (key === 'email' && typeof value === 'string' && value.trim() !== '') {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main', flexShrink: 0 }} />
          <a href={`mailto:${value}`} 
             style={{ 
               color: theme.palette.primary.main,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               display: 'block'
             }}
             title={value}
          >
            {value}
          </a>
        </Box>
      );
    }

    if (key === 'phone' && typeof value === 'string' && value.trim() !== '') {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main', flexShrink: 0 }} />
          <a href={`tel:${value}`} 
             style={{ 
               color: theme.palette.primary.main,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               display: 'block'
             }}
             title={value}
          >
            {value}
          </a>
        </Box>
      );
    }

    if (key === 'status' && typeof value === 'string' && value.trim() !== '') {
      let color = 'default';
      if (value === 'Активный') color = 'success';
      if (value === 'В отпуске') color = 'info';
      if (value === 'Больничный') color = 'warning';
      if (value === 'Удаленная работа') color = 'primary';
      
      return (
        <Tooltip title={value}>
          <Chip 
            label={value} 
            size="small" 
            color={color as any} 
            sx={{ 
              maxWidth: '100%',
              '.MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            }}
          />
        </Tooltip>
      );
    }

    if (key === 'salary' && typeof value === 'number' && value !== 0) {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
    }
    
    return value;
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    return Object.entries(record).some(([, value]) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (typeof value === 'number') {
        return value.toString().includes(searchTerm);
      }
      if (Array.isArray(value)) {
        return value.some(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const renderSortableHeader = (key: string) => {
    const displayName = key.charAt(0).toUpperCase() + key.slice(1);
    const isSortable = true;
    
    return isSortable ? (
      <TableSortLabel
        active={sortKey === key}
        direction={sortOrder}
        onClick={() => handleSort(key as SortKey)}
      >
        {displayName}
      </TableSortLabel>
    ) : displayName;
  };
  
  if (isLoading && records.length === 0) {
    return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <Skeleton animation="wave" variant="rectangular" height={56} />
        </Box>
        {[...Array(5)].map((_, index) => (
          <Skeleton 
            key={index} 
            animation="wave" 
            variant="rectangular" 
            height={52}
            sx={{ my: 0.5 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Поиск по таблице..."
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ maxWidth: 400 }}
        />
        <Box sx={{ ml: 2 }}>
          <Tooltip title="Отфильтрованные записи: таблица отображает только записи, соответствующие поисковому запросу">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {isFetchingNextPage && <LinearProgress sx={{ mt: 1 }} />}
      
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: 60, minWidth: 60 }}>
                <TableSortLabel
                  active={sortKey === 'id'}
                  direction={sortOrder}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              {columnKeys.map(key => {
                let width = '150px';
                let minWidth = '100px';
                
                if (key === 'name') {
                  width = '200px';
                  minWidth = '150px';
                } else if (key === 'email' || key === 'phone') {
                  width = '180px';
                  minWidth = '120px';
                } else if (key === 'skills' || key === 'languages') {
                  width = '220px';
                  minWidth = '150px';
                } else if (key === 'status') {
                  width = '120px';
                  minWidth = '100px';
                } else if (key === 'salary') {
                  width = '120px';
                  minWidth = '100px';
                }
                
                return (
                  <TableCell 
                    key={key} 
                    sx={{ 
                      fontWeight: 'bold',
                      width,
                      minWidth,
                      maxWidth: key === 'skills' || key === 'languages' ? '300px' : 'auto'
                    }}
                  >
                    {renderSortableHeader(key)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRecords.map((record, index) => (
              <Fade key={record.id} in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                <TableRow 
                  hover 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
                    }
                  }}
                >
                  <TableCell sx={{ width: 60, minWidth: 60 }}>{record.id}</TableCell>
                  {columnKeys.map(key => {
                    const cellStyles: any = {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '300px'
                    };
                    
                    if (key === 'skills' || key === 'languages') {
                      cellStyles.maxWidth = '300px';
                    }
                    
                    return (
                      <TableCell key={key} sx={cellStyles}>
                        {formatCellValue(record, key)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div ref={loaderRef} style={{ textAlign: 'center', padding: '20px' }}>
        {(isLoading || isFetchingNextPage) && <CircularProgress size={30} />}
        {!hasNextPage && records.length > 0 && (
          <Typography color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
            Вы просмотрели все записи
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default RecordsTable; 