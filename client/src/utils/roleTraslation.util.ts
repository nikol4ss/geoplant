import type { Occupation } from '@/models/modules/auth/enums.model';

export const occupationTranslation: Record<Occupation, string> = {
  Admin: 'Administrador',
  Student: 'Estudante',
  Teacher: 'Professor',
  Engineer: 'Engenheiro',
  Researcher: 'Pesquisador',
  Botanist: 'Botânico',
};
