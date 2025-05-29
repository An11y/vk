import { formatMoney, formatPhoneNumber, truncateText } from '../../utils/formatters';

describe('Функции форматирования', () => {
  describe('formatMoney', () => {
    test('должен форматировать целые числа с символом рубля', () => {
      expect(formatMoney(100000)).toMatch(/100[ \xa0]?000[ \xa0]?₽/);
      expect(formatMoney(10)).toMatch(/10[ \xa0]?₽/);
      expect(formatMoney(0)).toMatch(/0[ \xa0]?₽/);
    });
    
    test('должен обрабатывать отрицательные числа', () => {
      expect(formatMoney(-5000)).toMatch(/-5[ \xa0]?000[ \xa0]?₽/);
    });
  });
  
  describe('formatPhoneNumber', () => {
    test('должен форматировать российский номер из 11 цифр', () => {
      expect(formatPhoneNumber('89991234567')).toBe('+8 (999) 123-45-67');
      expect(formatPhoneNumber('79991234567')).toBe('+7 (999) 123-45-67');
    });
    
    test('должен форматировать номер из 10 цифр как российский с кодом +7', () => {
      expect(formatPhoneNumber('9991234567')).toBe('+7 (999) 123-45-67');
    });
    
    test('должен сохранять исходный формат для нестандартных номеров', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('+7 (999) 123-45-67')).toBe('+7 (999) 123-45-67');
    });
    
    test('должен удалять нецифровые символы перед форматированием', () => {
      expect(formatPhoneNumber('+7 (999) 123-45-67')).toBe('+7 (999) 123-45-67');
      expect(formatPhoneNumber('8-999-123-45-67')).toBe('+8 (999) 123-45-67');
    });
  });
  
  describe('truncateText', () => {
    test('должен обрезать длинный текст и добавлять многоточие', () => {
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna ultrices mattis non eget metus.';
      expect(truncateText(longText, 20)).toBe('Lorem ipsum dolor si...');
    });
    
    test('не должен обрезать текст, если он короче максимальной длины', () => {
      const shortText = 'Короткий текст';
      expect(truncateText(shortText, 20)).toBe(shortText);
    });
    
    test('должен использовать значение по умолчанию для maxLength', () => {
      const longText = 'a'.repeat(150);
      expect(truncateText(longText)).toBe('a'.repeat(100) + '...');
    });
  });
}); 