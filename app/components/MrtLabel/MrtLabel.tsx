import { SubwayOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export function MrtLabel({ mrt }: { mrt: string }) {
  const mrtT = useTranslations('MRT');
  return (
    <span className="flex gap-1 items-center">
      <SubwayOutlined fontSize="small" />
      <p className="font-public-sans font-medium max-w-22 wrap-break-word">{mrtT(mrt)}</p>
    </span>
  );
}
