import { isValidEmail, isValidPhone, hasMinLength, isInRange, hasItems } from '../../utils/validators';

describe('Функции валидации', () => {
  describe('isValidEmail', () => {
    test('должен возвращать true для валидных email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@mail.ru')).toBe(true);
      expect(isValidEmail('user+tag@gmail.com')).toBe(true);
      expect(isValidEmail('first.last@domain.co.uk')).toBe(true);
    });
    
    test('должен возвращать false для невалидных email', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user example.com')).toBe(false);
    });
  });
  
  describe('isValidPhone', () => {
    test('должен возвращать true для валидных телефонных номеров', () => {
      expect(isValidPhone('79991234567')).toBe(true);
      expect(isValidPhone('9991234567')).toBe(true);
      expect(isValidPhone('+7 (999) 123-45-67')).toBe(true);
      expect(isValidPhone('8-999-123-45-67')).toBe(true);
    });
    
    test('должен возвращать false для невалидных телефонных номеров', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('123456789')).toBe(false);
      expect(isValidPhone('123456789012')).toBe(false);
    });
  });
  
  describe('hasMinLength', () => {
    test('должен проверять минимальную длину строки', () => {
      expect(hasMinLength('hello', 5)).toBe(true);
      expect(hasMinLength('hello world', 5)).toBe(true);
      expect(hasMinLength('hi', 5)).toBe(false);
      expect(hasMinLength('', 1)).toBe(false);
    });
  });
  
  describe('isInRange', () => {
    test('должен проверять, что число находится в указанном диапазоне', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });
  
  describe('hasItems', () => {
    test('должен проверять наличие элементов в массиве', () => {
      expect(hasItems([1, 2, 3])).toBe(true);
      expect(hasItems(['test'])).toBe(true);
      expect(hasItems([])).toBe(false);
      expect(hasItems(null as any)).toBe(false);
      expect(hasItems(undefined as any)).toBe(false);
    });
  });
}); 