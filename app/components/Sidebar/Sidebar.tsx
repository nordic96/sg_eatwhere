'use client';

import useClickOutside from '@/app/hooks/useClickOutside';
import { useRef, memo } from 'react';

import CloseButton from '../CloseButton/CloseButton';
import Image from 'next/image';

import { useAppStore, useHeritageStore } from '@/app/stores';
import Divider from '../Divider';
import { MapOutlined, Public, SubwayOutlined, ThumbUpOutlined } from '@mui/icons-material';
import HighlightedText from '../HighlightText/HighlightText';
import VerticalDivider from '../VerticalDivider/VerticalDivider';
import { useTranslations } from 'next-intl';
import HelpTooltip from '../Tooltip/HelpTooltip';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

function Sidebar() {
  const target = useRef(null);
  const { closeMore } = useAppStore();
  const { getThemeStyle, getSelectedFoodData } = useHeritageStore();
  const data = getSelectedFoodData();

  const t = useTranslations('Sidebar');
  const mrtT = useTranslations('MRT');
  const catT = useTranslations('FoodCategory');
  const heritageT = useTranslations('Heritage');

  useClickOutside(target, closeMore);

  const onClose = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMore();
  };

  return (
    <div
      id="list-sidebar"
      ref={target}
      role="complementary"
      aria-label="Location details sidebar"
      className="absolute flex z-101 flex-col gap-2 -right-4 max-sm:right-0 max-sm:left-0 max-sm:bottom-0 max-sm:w-full max-sm:rounded-t-xl max-sm:rounded-b-none bg-white rounded-xl shadow-xl grow p-4 w-[384px] min-h-[850px] max-sm:min-h-[60vh] max-sm:max-h-[80vh] max-sm:overflow-y-auto transform translate-y-0 opacity-0 transition-transform duration-500 ease-in-out border border-[#333]"
    >
      <div className="flex justify-end">
        <CloseButton onClick={onClose} customClass={getThemeStyle()} />
      </div>
      {/* <PlaceContent /> */}
      {data && (
        <div className="flex flex-col gap-4 items-center">
          {/** Img Container */}
          <div className="flex flex-col grow w-full">
            <Image
              className={'h-[250px] object-cover'}
              width={350}
              height={250}
              src={data.imgSource[0]}
              draggable="false"
              alt={'main_photo'}
            />
            <div className="flex flex-wrap justify-center">
              {data.imgSource.slice(1).map((src, index) => (
                <Image
                  className="w-[110px] h-[110px] object-cover"
                  key={index}
                  src={src}
                  alt={''}
                  width={110}
                  height={110}
                  draggable="false"
                />
              ))}
            </div>
          </div>
          {/** Title Container */}
          <div className="flex flex-col items-center w-full">
            <span className="flex flex-col gap-1 items-center">
              <CategoryIcon alt={'sidebar_category_icon'} cat={data.category} />
              <span className={'flex items-center gap-1'}>
                {catT(data.category)}
                {data.category === 'hawker' && (
                  <HelpTooltip
                    direction={'right'}
                    msgKey={'what_is_hawker'}
                    iconProps={{ fontSize: 'small' }}
                  />
                )}
              </span>
            </span>
            <label className="text-3xl font-bold text-center">{data.name}</label>
            <label className="text-xs font-light">{data.location.address}</label>
            <Divider className={getThemeStyle()} />
            {/** Secondary Info Container */}
            <div className="flex items-center gap-1">
              <a href={data.location.gmapUrl} target="_blank">
                <MapOutlined fontSize={'small'} />
                <label>{t('map')}</label>
              </a>
              {data.website && (
                <a href={data.website} target={'_blank'}>
                  <Public fontSize={'small'} />
                  <label>{t('website')}</label>
                </a>
              )}
            </div>
          </div>
          {/** Tertiary Info Container */}
          <div className="flex flex-col items-center gap-1">
            <label>{t('must-try')}</label>
            <span className="flex justify-center items-center gap-1">
              <ThumbUpOutlined />
              <div>
                {data.recommendations.map((dish, i) => (
                  <HighlightedText key={i}>{dish}</HighlightedText>
                ))}
              </div>
            </span>
          </div>
          {/** MRT Container */}
          <div className="flex flex-col items-center gap-1">
            <label>{t('nearest-mrt')}</label>
            <span className="flex justify-center items-center gap-1">
              <SubwayOutlined />
              <div className="flex gap-1">
                {data.location.mrt.map((station, i) => (
                  <div
                    key={i}
                    className="wrap-word-break flex justify-center items-center text-center"
                  >
                    <label className="font-public-sans font-bold text-md pr-1 min-w-10 max-w-25">
                      {mrtT(station)}
                    </label>
                    {i < data.location.mrt.length - 1 ? <VerticalDivider /> : undefined}
                  </div>
                ))}
              </div>
            </span>
          </div>
          {/** Description Container */}
          <div>
            <span className="font-light text-xs whitespace-pre-line">
              {heritageT(`${data.id}_desc`)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Sidebar);
