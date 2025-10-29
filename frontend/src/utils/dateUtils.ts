export type FilterMode = 'weekly' | 'monthly' | 'annual';

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};


export const calculateDateRange = (
  currentDate: Date,
  mode: FilterMode
): { startDate: string; endDate: string; display: string } => {
  
  const date = new Date(currentDate.getTime());

  if (mode === 'weekly') {
    const dayOfWeek = date.getDay(); 
    const start = new Date(date.setDate(date.getDate() - dayOfWeek));
    const end = new Date(date.setDate(date.getDate() + 6));
    
    const displayStart = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const displayEnd = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    return {
      startDate: formatDateForAPI(start),
      endDate: formatDateForAPI(end),
      display: `${displayStart} - ${displayEnd}`,
    };
  }

  if (mode === 'annual') {
    const year = date.getFullYear();
    const start = new Date(year, 0, 1); 
    const end = new Date(year, 11, 31); 

    return {
      startDate: formatDateForAPI(start),
      endDate: formatDateForAPI(end),
      display: year.toString(),
    };
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); 
  
  const display = date.toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });
  
  return {
    startDate: formatDateForAPI(start),
    endDate: formatDateForAPI(end),
    display: display,
  };
};

export const navigateDate = (
  currentDate: Date,
  mode: FilterMode,
  direction: 'prev' | 'next'
): Date => {
  
  const newDate = new Date(currentDate.getTime());
  const directionValue = direction === 'prev' ? -1 : 1;

  if (mode === 'weekly') {
    newDate.setDate(newDate.getDate() + (7 * directionValue));
  } else if (mode === 'annual') {
    newDate.setFullYear(newDate.getFullYear() + directionValue);
  } else {
    newDate.setMonth(newDate.getMonth() + directionValue);
  }
  
  return newDate;
};