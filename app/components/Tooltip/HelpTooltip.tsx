import { FiHelpCircle } from 'react-icons/fi';
import Tooltip, { TooltipProps } from './Tooltip';
import { useTranslations } from 'next-intl';

type HelpTooltipProps = Omit<TooltipProps, 'content'> & {
  msgKey: string;
};

export default function HelpTooltip({ msgKey, ...tooltipProps }: HelpTooltipProps) {
  const tooltipT = useTranslations('Tooltip');
  return (
    <Tooltip {...tooltipProps} content={tooltipT(msgKey)}>
      <FiHelpCircle size={18} />
    </Tooltip>
  );
}
