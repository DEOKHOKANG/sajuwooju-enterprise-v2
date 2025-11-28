import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('기본 버튼 렌더링', () => {
    render(<Button>클릭하세요</Button>);
    const button = screen.getByRole('button', { name: /클릭하세요/i });
    expect(button).toBeInTheDocument();
  });

  it('버튼 텍스트가 올바르게 표시됨', () => {
    const buttonText = '테스트 버튼';
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it('클릭 이벤트 핸들러 동작', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>클릭</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서 클릭 불가', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        비활성화
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('variant prop에 따라 스타일 적용', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('size prop에 따라 크기 조정', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });

  it('asChild prop으로 자식 요소 렌더링', () => {
    render(
      <Button asChild>
        <a href="/test">링크 버튼</a>
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('type prop이 올바르게 적용됨', () => {
    const { rerender } = render(<Button type="button">Button</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');

    rerender(<Button type="submit">Submit</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('커스텀 className 적용', () => {
    const customClass = 'custom-button-class';
    render(<Button className={customClass}>Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('여러 번 클릭해도 정상 동작', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>멀티 클릭</Button>);

    const button = screen.getByRole('button');

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('children으로 복잡한 컨텐츠 렌더링', () => {
    render(
      <Button>
        <span className="icon">🚀</span>
        <span className="text">Launch</span>
      </Button>
    );

    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });
});
