import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' };
const lineClass = /(?:^|\s)(?:motion-line|hero-line|expertise-heading-line|iw-title-line|journey-heading-line|ke-final-line)(?:\s|$)/;
const mutedClass = /(?:^|\s)(?:heading-muted|about-heading-muted|about-title-muted)(?:\s|$)/;

/** Colour existing heading phrases without changing their text or animation wrappers. */
export function Heading({ as: Tag = 'h2', children, className = '', ...props }: HeadingProps) {
  let text = '';
  const phraseStarts: number[] = [];
  const lineStarts: number[] = [];

  const collect = (nodes: ReactNode) => {
    Children.forEach(nodes, node => {
      if (typeof node === 'string' || typeof node === 'number') {
        text += String(node);
      } else if (isValidElement<{ children?: ReactNode; className?: string }>(node)) {
        if (node.type === 'br') {
          text += '\n';
          lineStarts.push(text.length);
          return;
        }
        if (lineClass.test(node.props.className ?? '')) {
          text += '\n';
          lineStarts.push(text.length);
        }
        if (node.type === 'em' || mutedClass.test(node.props.className ?? '')) phraseStarts.push(text.length);
        collect(node.props.children);
      }
    });
  };
  collect(children);

  const validBoundary = (position: number) => text.slice(0, position).trim() && text.slice(position).trim();
  let boundary = phraseStarts.find(validBoundary) ?? lineStarts.find(validBoundary);
  if (boundary === undefined) {
    const words = [...text.matchAll(/\S+/g)];
    boundary = words.length > 1 ? words[Math.ceil(words.length / 2)].index : text.length;
  }

  let position = 0;
  const paint = (nodes: ReactNode): ReactNode => Children.map(nodes, node => {
    if (typeof node === 'string' || typeof node === 'number') {
      const value = String(node);
      const split = Math.max(0, Math.min(value.length, boundary - position));
      position += value.length;
      return <>
        {split > 0 && <span className="heading-tone-primary">{value.slice(0, split)}</span>}
        {split < value.length && <span className="heading-tone-muted">{value.slice(split)}</span>}
      </>;
    }
    if (!isValidElement<{ children?: ReactNode; className?: string }>(node)) return node;
    if (node.type === 'br') { position += 1; return node; }
    if (lineClass.test(node.props.className ?? '')) position += 1;
    if (node.props.children === undefined) return node;
    return cloneElement(node, undefined, paint(node.props.children));
  });

  return <Tag {...props} className={`two-tone-heading ${className}`.trim()}>{paint(children)}</Tag>;
}
