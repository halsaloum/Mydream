import Foundation
import PDFKit
import Vision
import AppKit
let args = CommandLine.arguments
let source = args[1]
let output = args[2]
let first = Int(args[3])!
let last = Int(args[4])!
guard let doc = PDFDocument(url: URL(fileURLWithPath: source)) else { fatalError("PDF could not open") }
let fm = FileManager.default
try fm.createDirectory(atPath: output, withIntermediateDirectories: true)
for i in first...last {
 autoreleasepool {
  let dest = output + "/" + String(format:"%04d",i) + ".txt"
  if fm.fileExists(atPath:dest) {return}
  guard let page = doc.page(at:i-1) else {return}
  let bounds = page.bounds(for: .mediaBox)
  let width: CGFloat = 1600
  let im = page.thumbnail(of: NSSize(width:width,height:width*bounds.height/bounds.width),for:.mediaBox)
  var rect=CGRect(origin:.zero,size:im.size)
  guard let cg=im.cgImage(forProposedRect:&rect,context:nil,hints:nil) else {return}
  let req=VNRecognizeTextRequest()
  req.recognitionLevel = .accurate
  req.usesCPUOnly = true
  req.recognitionLanguages=["en-US"]
  req.usesLanguageCorrection=true
  do {
   try VNImageRequestHandler(cgImage:cg,options:[:]).perform([req])
   let txt=(req.results ?? []).compactMap{$0.topCandidates(1).first?.string}.joined(separator:"\n")
   try txt.write(toFile:dest,atomically:true,encoding:.utf8)
   if i % 10 == 0 {print("OCR page \(i)"); fflush(stdout)}
  } catch {print("ERROR page \(i): \(error)"); fflush(stdout)}
 }
}
