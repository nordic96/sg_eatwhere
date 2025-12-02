export default function HighlightedText(props: React.PropsWithChildren) {
  return (
    <div className="">
      <p className="text-md relative">
        {props.children}
        <span className="absolute inset-0 bottom-0 bg-goldenmile opacity-30" />
      </p>
    </div>
  );
}
