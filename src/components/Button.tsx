import classNames from "classnames"
import { PropsWithChildren } from "react"

type ButtonProps = PropsWithChildren & {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    fullWidth?: boolean
    disabled?: boolean
    className?: string
}

const Button = ({ children, onClick, fullWidth = false, disabled = false, className = "" }: ButtonProps) => {
    return <button
        className={classNames(
            "flex my-2 justify-center p-1 bg-blue-500 active:bg-blue-500/70 disabled:bg-zinc-700 disabled:shadow-none rounded-md transition-all",
            fullWidth ? "w-full" : "w-fit",
            className
        )}
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </button>
}

export default Button