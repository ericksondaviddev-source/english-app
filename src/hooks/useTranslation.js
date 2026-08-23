import { useState, useCallback } from 'react';
import { hybridTranslate, offlineTranslate } from '../services/translationService';

export function useTranslation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const result = await hybridTranslate(text);
      return result;
    } catch (err) {
      setError(err.message);
      return { translation: text, source: 'error' };
    } finally {
      setLoading(false);
    }
  }, []);

  const translateOffline = useCallback((text) => {
    return offlineTranslate(text);
  }, []);

  return { translate, translateOffline, loading, error };
}
