export const abbreviatedName = (name?: string | null, surname?: string | null) => {
  const firstInitial = name?.[0]?.toUpperCase() ?? '';
  const lastInitial = surname?.[0]?.toUpperCase() ?? '';

  return `${firstInitial}${lastInitial}`;
};
