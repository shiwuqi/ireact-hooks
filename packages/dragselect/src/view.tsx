import * as React from 'react'
import './index.css'
const { useState, useRef, useCallback } = React

export type DragSelectType = {
    cols: any[];
    rows: any[];
    onChange: (params: string[][]) => void;
}

export default function DragSelect(props: DragSelectType) {
    const [allCheck, setAllCheck] = useState<string[]>([])
    const [currentCheck, setCurrentCheck] = useState<string[]>([])
    const [currentRemove, setCurrentRemove] = useState<string[]>([])
    const [direact, setDireact] = useState<'add' | 'remove'>('add')
    const startCoordinate = useRef<{
        startRow: number;
        startCol: number;
    }>({
        startRow: -1,
        startCol: -1
    })
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

    const getCurrentDomAttribute = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
        const row = Number((e.target as any).getAttribute('data-row')),
            col = Number((e.target as any).getAttribute('data-col'))
        return { row, col }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
        const { row, col } = getCurrentDomAttribute(e)
        setIsMouseDown(true)
        startCoordinate.current = {
            startRow: row,
            startCol: col
        }
        setDireact(allCheck.includes(row + '-' + col) ? 'remove' : 'add')
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
        if (!isMouseDown) return
        const { row, col } = getCurrentDomAttribute(e)
        let { startRow, startCol } = startCoordinate.current
        const durationRow = row - startRow, durationCol = col - startCol
        let minX = -1, maxX = -1, minY = -1, maxY = -1, addGroup: string[] = [], removeGroup: string[] = []
        if (durationRow > 0) {
            minX = startRow
            maxX = row
        } else {
            minX = row
            maxX = startRow
        }
        if (durationCol > 0) {
            minY = startCol
            maxY = col
        } else {
            minY = col
            maxY = startCol
        }
        for (let i = minX; i <= maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                const str = i + '-' + j, index = addGroup.indexOf(str), bIndex = allCheck.indexOf(str)
                if (direact === 'add' && index < 0) {
                    addGroup.push(str)
                }
                if (direact === 'remove' && bIndex > -1) {
                    removeGroup.push(str)
                }
            }
        }
        setCurrentCheck(addGroup)
        setCurrentRemove(removeGroup)
    }

    const handleMouseUp = () => {
        let { startRow, startCol } = startCoordinate.current, _currentCheck = currentCheck, _currentRemove = currentRemove
        if (direact === 'add') {
            _currentCheck = [...currentCheck, `${startRow}-${startCol}`]
        } else {
            _currentRemove = [...currentRemove, `${startRow}-${startCol}`]
        }
        let _data = [...allCheck, ..._currentCheck]
        _data = _data.filter(item => !_currentRemove.includes(item))
        setIsMouseDown(false)
        setAllCheck(_data)
        setCurrentCheck([])
        setCurrentRemove([])
        const params = _data.map(item => item.split('-'))
        props.onChange(params)
    }

    const renderTable = useCallback(() => {
        const _checks = allCheck.concat(currentCheck)
        return (
            props.cols.map((ele, index) => {
                return (
                    <tr className='tableTr' key={index} >
                        {
                            props.rows.map((_, i) => {
                                const idx = index + '-' + i
                                const flag = _checks.includes(idx) && !currentRemove.includes(idx)
                                return (
                                    <td
                                        className={`tableTd ${flag ? 'tableTdActive' : ''}`}
                                        data-row={index}
                                        data-col={i}
                                        key={`${ele}-${i}`}></td>
                                )
                            })
                        }
                    </tr >
                )
            })
        )
    }, [allCheck, currentCheck, currentRemove])

    return (
        (
            <table
                className='table'
                cellSpacing={0}
                cellPadding={0}
                onMouseDown={(e) => handleMouseDown(e)} 
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseUp={() => handleMouseUp()}>
                <tbody>
                    {renderTable()}
                </tbody>
            </table>
        )
    )
}