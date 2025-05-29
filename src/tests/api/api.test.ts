import type { Record, RecordFormData } from '../../types';

import { fetchRecords, createRecord } from '../../api';

jest.mock('../../api/index', () => ({
  fetchRecords: jest.fn(),
  createRecord: jest.fn()
}));

describe('API функции', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRecords: Record[] = [
    {
      id: 1,
      name: "Антон",
      email: "ivan@gmail.com",
      phone: "+7 (999) 123-45-67",
      position: "Разработчик",
      department: "IT",
      salary: 100000,
      address: "Москва, ул. Арбат, 1",
      skills: ["JavaScript", "React", "TypeScript"]
    },
    {
      id: 2,
      name: "Мария",
      email: "maria@gmail.com",
      phone: "+7 (999) 765-43-21",
      position: "Дизайнер",
      department: "UX/UI",
      salary: 90000,
      address: "Санкт-Петербург, ул. Арбат, 2",
      skills: ["Figma", "Photoshop", "Illustrator"]
    }
  ];

  test('fetchRecords должен возвращать данные и общее количество записей', async () => {
    (fetchRecords as jest.Mock).mockResolvedValue({
      data: mockRecords,
      total: 2
    });

    const result = await fetchRecords({ _page: 1, _limit: 10 });
    
    expect(fetchRecords).toHaveBeenCalledWith({ _page: 1, _limit: 10 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result.data).toEqual(mockRecords);
    expect(result.total).toBe(2);
  });

  test('createRecord должен создавать новую запись', async () => {
    const newRecord: RecordFormData = {
      name: "Алексей",
      email: "alex@gmail.com",
      phone: "+7 (999) 111-22-33",
      position: "Менеджер",
      department: "Продажи",
      salary: 85000,
      address: "Казань, ул. Арбат, 3",
      skills: ["Продажи", "Переговоры", "CRM"]
    };
    
    const createdRecord = { ...newRecord, id: 3 } as Record;
    
    (createRecord as jest.Mock).mockResolvedValue(createdRecord);
    
    const result = await createRecord(newRecord);
    
    expect(createRecord).toHaveBeenCalledWith(newRecord);
    expect(result).toHaveProperty('id', 3);
    expect(result.name).toBe(newRecord.name);
    expect(result.email).toBe(newRecord.email);
    expect(result.skills).toEqual(newRecord.skills);
  });

  test('fetchRecords должен обрабатывать ошибку сети', async () => {
    (fetchRecords as jest.Mock).mockRejectedValue(new Error('Ошибка сети'));
    
    await expect(fetchRecords({ _page: 1, _limit: 10 })).rejects.toThrow('Ошибка сети');
  });
});