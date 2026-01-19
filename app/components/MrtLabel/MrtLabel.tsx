import { useTranslations } from 'next-intl';
import { FaSubway } from 'react-icons/fa';

export function MrtLabel({ mrt }: { mrt: string }) {
  const mrtT = useTranslations('MRT');
  return (
    <span className="flex gap-1 items-center">
      <FaSubway size={18} />
      <p className="font-public-sans font-medium max-w-22 wrap-break-word">{mrtT(mrt)}</p>
    </span>
  );
}
