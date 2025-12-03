/* eslint-disable @next/next/no-img-element */
'use client';

import useClickOutside from '@/app/hooks/useClickOutside';
import { useMemo, useRef } from 'react';
import { CAT_ASSET_MAP, data as foodData } from '@/app/constants/data';

import CloseButton from '../CloseButton/CloseButton';
import { useHeritageStore } from '@/app/stores';
import Divider from '../Divider';
import { MapOutlined, Public, SubwayOutlined, ThumbUpOutlined } from '@mui/icons-material';
import HighlightedText from '../HighlightText/HighlightText';
import VerticalDivider from '../VerticalDivider/VerticalDivider';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const target = useRef(null);
  const { closeMore, heritageId, getThemeStyle } = useHeritageStore();
  const data = useMemo(() => {
    return foodData.find((item) => item.id === heritageId) || null;
  }, [heritageId]);

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
      className="absolute flex flex-col gap-2 right-0 bg-white rounded-xl shadow-xl grow p-4 w-[384px] min-h-[850px] transform translate-y-0 opacity-0 transition-transform duration-500 ease-in-out"
    >
      <div className="flex justify-end">
        <CloseButton onClick={onClose} customClass={getThemeStyle()} />
      </div>
      {/* <PlaceContent /> */}
      {data && (
        <div className="flex flex-col gap-4 items-center">
          {/** Img Container */}
          <div className="flex flex-col grow w-full">
            <img
              className="object-cover h-[250px] w-full"
              src={data.imgSource[0]}
              draggable="false"
              alt={'main_photo'}
            />
            <div className="flex flex-wrap justify-center">
              {data.imgSource.slice(1).map((src, index) => (
                <img
                  className="w-[110px] h-[110px] object-cover"
                  key={index}
                  src={src}
                  alt={''}
                  draggable="false"
                />
              ))}
            </div>
          </div>
          {/** Title Container */}
          <div className="flex flex-col items-center w-full">
            <label className="text-3xl font-bold text-center">{data.name}</label>
            <label className="text-xs font-light">{data.location.address}</label>
            <span className="flex gap-1 items-center">
              <img
                className="h-6"
                src={CAT_ASSET_MAP[data.category]}
                alt={'icon'}
                draggable="false"
              />
              <p>{catT(data.category)}</p>
            </span>
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
              <span>
                <label className="font-bold">{'$$'}</label>
                <label>{'10-20 pax'}</label>
              </span>
            </div>
          </div>
          {/** Tertiary Info Container */}
          <div className="flex flex-col items-center gap-1">
            <label>{t('must-try')}</label>
            <span className="flex justify-center items-center gap-1">
              <ThumbUpOutlined />
              <div>
                {data.bestDish.map((dish, i) => (
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
                    className="wrap-word-break max-w-20 flex justify-center items-center text-center"
                  >
                    <label className="font-public-sans font-bold text-md pr-1">
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
            <p className="font-light text-xs">{heritageT(`${data.id}_desc`)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
