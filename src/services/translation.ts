export const translationService = {
  async translateToEnglish(text: string): Promise<string> {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      if (data && data[0]) {
        return data[0].map((item: any) => item[0]).join('');
      }
      return text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    }
  }
};
