import { FiHelpCircle } from 'react-icons/fi';
import Tooltip, { TooltipProps } from './Tooltip';
import { useTranslations } from 'next-intl';
import { IconType } from 'react-icons';

type HelpTooltipProps = Omit<TooltipProps, 'content'> & {
  msgKey: string;
  iconProps?: IconType;
};

export default function HelpTooltip({ msgKey, iconProps, ...tooltipProps }: HelpTooltipProps) {
  const tooltipT = useTranslations('Tooltip');
  return (
    <Tooltip {...tooltipProps} content={tooltipT(msgKey)}>
      <FiHelpCircle size={18} {...iconProps} />
    </Tooltip>
  );
}
